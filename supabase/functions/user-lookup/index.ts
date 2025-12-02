import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const USER_API = 'http://3.107.169.231';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchType, searchValue } = await req.json();
    
    console.log(`User lookup request - Type: ${searchType}, Value: ${searchValue}`);
    
    if (!searchValue) {
      return new Response(
        JSON.stringify({ error: 'Search value is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const endpoint = searchType === 'mobile'
      ? `/user/mobile/${encodeURIComponent(searchValue)}`
      : `/user/id/${encodeURIComponent(searchValue)}`;

    const url = `${USER_API}${endpoint}`;
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      return new Response(
        JSON.stringify({ error: 'User not found', status: response.status }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('User data retrieved successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-lookup function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
