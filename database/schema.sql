-- HealthSure Database Schema for MySQL
-- Complete schema for Health Insurance Management System

CREATE DATABASE IF NOT EXISTS healthsure;
USE healthsure;

-- Users table (authentication)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'agent', 'customer') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agents table
CREATE TABLE agents (
    agent_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    branch VARCHAR(100),
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_name (name),
    INDEX idx_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    agent_id INT,
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_agent (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Base Policies table
CREATE TABLE policies (
    policy_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('health', 'life', 'family') NOT NULL,
    description TEXT,
    base_premium DECIMAL(10,2) NOT NULL,
    coverage_amount DECIMAL(12,2) NOT NULL,
    duration_years INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Health-specific policy details
CREATE TABLE health_policies (
    health_policy_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT UNIQUE NOT NULL,
    hospital_coverage TEXT,
    network_hospitals TEXT,
    pre_existing_diseases_covered BOOLEAN DEFAULT FALSE,
    cashless_facility BOOLEAN DEFAULT TRUE,
    annual_health_checkup BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Life insurance policy details
CREATE TABLE life_policies (
    life_policy_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT UNIQUE NOT NULL,
    nominee_name VARCHAR(255) NOT NULL,
    nominee_relation VARCHAR(100),
    maturity_benefit DECIMAL(12,2) NOT NULL,
    death_benefit DECIMAL(12,2) NOT NULL,
    surrender_value DECIMAL(12,2),
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Family floater policy details
CREATE TABLE family_policies (
    family_policy_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT UNIQUE NOT NULL,
    no_of_dependents INT DEFAULT 4,
    maternity_cover BOOLEAN DEFAULT TRUE,
    new_born_baby_cover BOOLEAN DEFAULT TRUE,
    vaccination_cover BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Policy holders (customer-policy assignments)
CREATE TABLE policy_holders (
    holder_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    policy_id INT NOT NULL,
    agent_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    premium_amount DECIMAL(10,2) NOT NULL,
    payment_frequency ENUM('monthly', 'quarterly', 'half_yearly', 'annual') DEFAULT 'annual',
    status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_policy (policy_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Claims table
CREATE TABLE claims (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    holder_id INT NOT NULL,
    claim_amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    claim_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    approved_amount DECIMAL(10,2),
    remarks TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    documents TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (holder_id) REFERENCES policy_holders(holder_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_holder (holder_id),
    INDEX idx_status (status),
    INDEX idx_claim_date (claim_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    holder_id INT,
    claim_id INT,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('premium', 'claim_settlement') NOT NULL,
    payment_method ENUM('cash', 'card', 'upi', 'netbanking', 'cheque') NOT NULL,
    transaction_id VARCHAR(255),
    payment_date DATE NOT NULL,
    status ENUM('success', 'pending', 'failed') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (holder_id) REFERENCES policy_holders(holder_id) ON DELETE CASCADE,
    FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE,
    INDEX idx_holder (holder_id),
    INDEX idx_claim (claim_id),
    INDEX idx_type (type),
    INDEX idx_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support queries/tickets
CREATE TABLE support_queries (
    query_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    response TEXT,
    responded_by INT,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (responded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: Admin@123)
-- Password hash generated using bcrypt with 10 rounds
INSERT INTO users (email, password_hash, role, status) VALUES 
('admin@healthsure.com', '$2b$10$rXKZ7EqKjZY3h3J5YL4qLOq.kv6yH3ZQx5qZQ5qZQ5qZQ5qZQ5qZQ', 'admin', 'active');

-- Sample policies
INSERT INTO policies (name, type, description, base_premium, coverage_amount, duration_years, status) VALUES
('Premium Health Shield', 'health', 'Comprehensive health insurance with cashless facility', 15000.00, 500000.00, 1, 'active'),
('Family Care Plus', 'family', 'Complete family floater with maternity coverage', 25000.00, 1000000.00, 1, 'active'),
('Life Secure Pro', 'life', 'Term life insurance with high coverage', 12000.00, 5000000.00, 20, 'active'),
('Senior Citizen Health', 'health', 'Specialized health plan for seniors', 20000.00, 300000.00, 1, 'active');

INSERT INTO health_policies (policy_id, hospital_coverage, network_hospitals, pre_existing_diseases_covered, cashless_facility) VALUES
(1, 'Room rent, ICU, Surgery, Diagnostics', 'Apollo, Fortis, Max, AIIMS', TRUE, TRUE),
(4, 'Room rent, ICU, Surgery, Doctor visits', 'Apollo, Manipal, Medanta', TRUE, TRUE);

INSERT INTO family_policies (policy_id, no_of_dependents, maternity_cover, new_born_baby_cover) VALUES
(2, 4, TRUE, TRUE);

INSERT INTO life_policies (policy_id, nominee_name, nominee_relation, maturity_benefit, death_benefit) VALUES
(3, 'Spouse', 'Spouse', 0, 5000000.00);
