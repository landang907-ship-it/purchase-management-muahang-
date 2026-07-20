import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abfrrzuxvbnvizlwpxea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZnJyenV4dmJudml6bHdweGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQ4MDEsImV4cCI6MjA5ODI5MDgwMX0.A9AzG5eHUseszQ_MoN0NuQSo2TX2FXmIHpeih87bdn0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    const { data, error } = await supabase
        .from('purchase_orders')
        .update({
            is_urgent: true,
            urgent_reason: 'test reason',
            urgent_image_url: 'http://test.com/img.jpg'
        })
        .eq('user_id', 'test_user_id')
        .eq('unique_order_key', 'test_key');
        
    console.log('Update error:', error);
}

testUpdate();
