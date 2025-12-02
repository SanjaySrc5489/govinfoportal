import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VEHICLE_DETAILS_API = 'http://45.79.121.32:5050/vahan';
const VEHICLE_MOBILE_API = 'http://45.79.121.32:5000/vahan';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registration } = await req.json();
    
    console.log(`Vehicle lookup request - Registration: ${registration}`);
    
    if (!registration) {
      return new Response(
        JSON.stringify({ error: 'Registration number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Get vehicle details
    const detailsUrl = `${VEHICLE_DETAILS_API}?reg=${encodeURIComponent(registration)}`;
    console.log(`Fetching vehicle details from: ${detailsUrl}`);

    const detailsResponse = await fetch(detailsUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!detailsResponse.ok) {
      console.error(`Vehicle details API returned status: ${detailsResponse.status}`);
      return new Response(
        JSON.stringify({ error: 'Vehicle not found', status: detailsResponse.status }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const vehicleData = await detailsResponse.json();
    console.log('Vehicle details retrieved:', JSON.stringify(vehicleData).substring(0, 200));

    if (!vehicleData || !vehicleData.data) {
      return new Response(
        JSON.stringify({ error: 'Vehicle not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result: Record<string, unknown> = {
      vehicle_details: vehicleData.data
    };

    // Step 2: Try to get mobile number using chassis
    const chassis = vehicleData.data.chassis_no || '';
    if (chassis.length >= 5) {
      const last5 = chassis.slice(-5);
      const mobileUrl = `${VEHICLE_MOBILE_API}?reg=${encodeURIComponent(registration)}&chassis=${encodeURIComponent(last5)}`;
      console.log(`Fetching mobile number from: ${mobileUrl}`);

      try {
        const mobileResponse = await fetch(mobileUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (mobileResponse.ok) {
          const mobileData = await mobileResponse.json();
          console.log('Mobile data retrieved:', JSON.stringify(mobileData).substring(0, 100));
          result.mobile_info = mobileData;
        } else {
          console.log('Mobile lookup returned non-OK status:', mobileResponse.status);
        }
      } catch (mobileError) {
        console.error('Mobile lookup failed:', mobileError);
        // Continue without mobile info
      }
    } else {
      console.log('Chassis number too short for mobile lookup:', chassis);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in vehicle-lookup function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch vehicle data';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
