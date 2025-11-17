import { supabase } from "@/integrations/supabase/client";

export const registerUser = async (data: {
  email: string;
  password: string;
  role: string;
  name: string;
  phone: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
}) => {
  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        role: data.role,
        name: data.name,
        phone: data.phone,
      }
    }
  });

  if (authError) throw authError;

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user!.id,
      email: data.email,
      role: data.role as any,
    });

  if (profileError) throw profileError;

  // Create role-specific record
  if (data.role === 'customer') {
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        user_id: authData.user!.id,
        full_name: data.name,
        phone: data.phone,
        date_of_birth: data.dateOfBirth || new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        address: data.address || '',
      });
    if (customerError) throw customerError;
  } else if (data.role === 'agent') {
    const { error: agentError } = await supabase
      .from('agents')
      .insert({
        user_id: authData.user!.id,
        full_name: data.name,
        phone: data.phone,
      });
    if (agentError) throw agentError;
  }

  return authData;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;
  return authData;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};