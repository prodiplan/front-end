/**
 * Test script untuk API Grading Result
 * Cara pakai:
 * 1. Set TOKEN dan SESSION_ID
 * 2. Run: node test-result-api.js
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ========================================
// KONFIGURASI - GANTI INI
// ========================================
const TOKEN = 'YOUR_AUTH_TOKEN_HERE'; // Ganti dengan token dari browser
const SESSION_ID = 'YOUR_SESSION_ID_HERE'; // Ganti dengan session ID yang valid

// ========================================
// TEST FUNCTIONS
// ========================================

async function testGetSession() {
    console.log('\n=== TEST 1: GET /api/grading/sessions/{sessionId} ===\n');

    const url = `${API_BASE_URL}/grading-sessions/${SESSION_ID}`;
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        const data = await response.json();
        console.log('\nResponse:');
        console.log(JSON.stringify(data, null, 2));

        if (data.success && data.data) {
            console.log('\n✅ Session data retrieved successfully!');
            console.log(`   - Target Major: ${data.data.target_major}`);
            console.log(`   - Status: ${data.data.status}`);
            console.log(`   - Score: ${data.data.current_score}`);
            return data.data;
        } else {
            console.log('\n❌ Failed to retrieve session data');
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }

    return null;
}

async function testGetResult() {
    console.log('\n=== TEST 2: GET /api/results/{sessionId} ===\n');

    const url = `${API_BASE_URL}/grading-results/${SESSION_ID}`;
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        const data = await response.json();
        console.log('\nResponse:');
        console.log(JSON.stringify(data, null, 2));

        if (data.success && data.data) {
            console.log('\n✅ Result data retrieved successfully!');
            console.log(`   - Final Score: ${data.data.final_score}`);
            console.log(`   - Readiness Level: ${data.data.readiness_level}`);

            if (data.data.analysis_report) {
                const report = data.data.analysis_report;
                console.log('\n📊 Analysis Report:');
                console.log(`   - Summary: ${report.summary?.substring(0, 100)}...`);
                console.log(`   - Strengths: ${typeof report.strengths === 'string' ? 'Plain text' : 'Array'}`);
                console.log(`   - Weaknesses: ${typeof report.weaknesses === 'string' ? 'Plain text' : 'Array'}`);
                console.log(`   - Recommendations: ${typeof report.recommendations === 'string' ? 'Plain text' : 'Array'}`);

                if (report.book_recommendations) {
                    console.log(`   - Book Recommendations: ${report.book_recommendations.length} items`);
                }
                if (report.learning_path) {
                    console.log(`   - Learning Path: ${report.learning_path.length} phases`);
                }
                if (report.action_plan) {
                    console.log(`   - Action Plan: ${report.action_plan.length} items`);
                }
                if (report.industry_insights) {
                    console.log(`   - Industry Insights: ✅ Available`);
                }
            }

            return data.data;
        } else if (!data.success && data.error?.code === 'RESULT_NOT_READY') {
            console.log('\n⏳ Result is still being processed...');
        } else {
            console.log('\n❌ Failed to retrieve result data');
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }

    return null;
}

async function validateResultStructure(result) {
    console.log('\n=== VALIDATION: Result Structure ===\n');

    const checks = [];

    // Required root fields
    checks.push(['final_score', typeof result.final_score === 'number' && result.final_score >= 0 && result.final_score <= 100]);
    checks.push(['readiness_level', ['ready', 'not_ready', 'needs_improvement'].includes(result.readiness_level)]);
    checks.push(['created_at', !!result.created_at]);

    const report = result.analysis_report || {};

    // Required analysis fields
    checks.push(['summary', typeof report.summary === 'string' && report.summary.length >= 50]);
    checks.push(['strengths', typeof report.strengths === 'string' && report.strengths.length >= 50]);
    checks.push(['weaknesses', typeof report.weaknesses === 'string' && report.weaknesses.length >= 50]);
    checks.push(['recommendations', typeof report.recommendations === 'string' && report.recommendations.length >= 100]);

    // Key insights
    const insights = report.key_insights || {};
    checks.push(['motivation_score', typeof insights.motivation_score === 'number']);
    checks.push(['technical_understanding', typeof insights.technical_understanding === 'number']);
    checks.push(['career_alignment', typeof insights.career_alignment === 'number']);

    // Personality traits
    const traits = report.personality_traits || {};
    const validLevels = ['high', 'medium', 'low'];
    checks.push(['analytical_thinking', validLevels.includes(traits.analytical_thinking)]);
    checks.push(['problem_solving', validLevels.includes(traits.problem_solving)]);
    checks.push(['creativity', validLevels.includes(traits.creativity)]);

    // Arrays
    checks.push(['career_suggestions', Array.isArray(report.career_suggestions) && report.career_suggestions.length >= 3]);
    checks.push(['book_recommendations', Array.isArray(report.book_recommendations) && report.book_recommendations.length >= 3]);
    checks.push(['learning_path', Array.isArray(report.learning_path) && report.learning_path.length === 3]);
    checks.push(['action_plan', Array.isArray(report.action_plan) && report.action_plan.length >= 5]);

    // Industry insights
    const industry = report.industry_insights || {};
    checks.push(['industry_insights.job_market_demand', ['high', 'medium', 'low'].includes(industry.job_market_demand)]);
    checks.push(['industry_insights.growth_potential', typeof industry.growth_potential === 'number']);

    let passed = 0;
    let failed = 0;

    checks.forEach(([field, isValid]) => {
        const status = isValid ? '✅' : '❌';
        console.log(`${status} ${field}`);
        if (isValid) passed++;
        else failed++;
    });

    console.log(`\n📊 Validation Summary: ${passed}/${checks.length} passed`);

    if (failed === 0) {
        console.log('🎉 All validations passed!');
    } else {
        console.log(`⚠️ ${failed} validation(s) failed`);
    }
}

// ========================================
// MAIN
// ========================================

async function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   API Grading Result Test Script      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\nAPI Base URL: ${API_BASE_URL}`);
    console.log(`Session ID: ${SESSION_ID}`);

    // Validasi konfigurasi
    if (TOKEN === 'YOUR_AUTH_TOKEN_HERE') {
        console.log('\n❌ ERROR: Please set TOKEN in the script!');
        console.log('\n💡 How to get token:');
        console.log('   1. Login to the app in browser');
        console.log('   2. Open DevTools (F12)');
        console.log('   3. Go to Application/Storage > Local Storage');
        console.log('   4. Copy the "token" value');
        return;
    }

    if (SESSION_ID === 'YOUR_SESSION_ID_HERE') {
        console.log('\n❌ ERROR: Please set SESSION_ID in the script!');
        console.log('\n💡 How to get session ID:');
        console.log('   1. Go to /profile in the app');
        console.log('   2. Click on any completed assessment');
        console.log('   3. Copy the session ID from the URL');
        console.log('      Format: /profile/result/[SESSION_ID]');
        return;
    }

    // Test 1: Get Session
    const session = await testGetSession();

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Get Result
    const result = await testGetResult();

    // Validate structure if result exists
    if (result) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await validateResultStructure(result);
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║         Test Completed                 ║');
    console.log('╚════════════════════════════════════════╝\n');
}

main().catch(console.error);
