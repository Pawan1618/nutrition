import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const GITHUB_REPO_OWNER = 'Pawan1618';
const GITHUB_REPO_NAME = 'nutrition';

export async function POST(request: Request) {
    if (!GITHUB_TOKEN) {
        return NextResponse.json(
            { error: 'GitHub Access Token not configured on server' },
            { status: 500 }
        );
    }

    try {
        const { title, body, label } = await request.json();

        if (!title || !body) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        const issueData = {
            title: title,
            body: `${body}\n\n---\n*Submitted via Nutrition Tracker Feedback Form*`,
            labels: label ? [label, 'user-feedback'] : ['user-feedback']
        };

        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create issue on GitHub');
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            issueUrl: data.html_url
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        console.error('Feedback Submission Error:', error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
