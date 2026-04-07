<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01);
        }

        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 48px 32px;
            text-align: center;
            color: white;
        }

        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .email-header p {
            margin: 12px 0 0;
            font-size: 16px;
            opacity: 0.95;
        }

        .email-content {
            padding: 40px 32px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }

        .message-body {
            color: #4b5563;
            line-height: 1.7;
            font-size: 16px;
        }

        .message-body p {
            margin-bottom: 16px;
        }

        .message-body ul,
        .message-body ol {
            margin-bottom: 16px;
            padding-left: 24px;
        }

        .message-body li {
            margin-bottom: 8px;
        }

        .message-body a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px solid #c7d2fe;
        }

        .message-body a:hover {
            color: #5b67e0;
            border-bottom-color: #667eea;
        }

        .message-body strong {
            color: #1f2937;
            font-weight: 600;
        }

        .info-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 24px 0;
            border-radius: 8px;
        }

        .info-box p {
            margin: 0;
            color: #065f46;
            font-size: 14px;
        }

        .job-details {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            border: 1px solid #e5e7eb;
        }

        .job-details h3 {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin: 0 0 12px 0;
        }

        .job-details p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 500;
            margin: 24px 0;
            transition: transform 0.2s, box-shadow 0.2s;
            border: none;
            cursor: pointer;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, #e5e7eb, #9ca3af, #e5e7eb);
            margin: 32px 0 24px;
        }

        .email-footer {
            background-color: #f9fafb;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .email-footer p {
            margin: 0 0 8px;
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
        }

        .social-links {
            margin: 20px 0 0;
            padding: 0;
            list-style: none;
        }

        .social-links li {
            display: inline-block;
            margin: 0 8px;
        }

        .social-links a {
            color: #9ca3af;
            text-decoration: none;
            font-size: 20px;
            transition: color 0.2s;
        }

        .social-links a:hover {
            color: #667eea;
        }

        @media (max-width: 600px) {
            .email-header {
                padding: 32px 24px;
            }

            .email-header h1 {
                font-size: 24px;
            }

            .email-content {
                padding: 32px 24px;
            }

            .email-footer {
                padding: 24px;
            }
        }
    </style>
</head>

<body
    style="margin: 0; padding: 20px 0; background-color: #f3f4f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto;">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <h1>{{ $companyName }}</h1>
                <p>Career Opportunities</p>
            </div>

            <!-- Content -->
            <div class="email-content">
                <div class="greeting">
                    Dear {{ $applicantName }},
                </div>

                <div class="message-body">
                    {!! $content !!}
                </div>

                @if ($jobTitle)
                    <div class="job-details">
                        <h3>📋 Application Reference</h3>
                        <p><strong>Position:</strong> {{ $jobTitle }}</p>
                        @if ($applicationId)
                            <p><strong>Application ID:</strong> #{{ $applicationId }}</p>
                        @endif
                        <p><strong>Date:</strong> {{ date('F j, Y') }}</p>
                    </div>
                @endif

                <div class="info-box">
                    <p>
                        <strong>💡 Quick Tip:</strong> You can check your application status anytime by logging into
                        your account dashboard.
                    </p>
                </div>

                <div style="text-align: center;">
                    <a href="{{ url('/') }}" class="button">
                        Visit Our Career Portal
                    </a>
                </div>

                <div class="divider"></div>

                <div style="text-align: center; font-size: 14px; color: #6b7280;">
                    <p>Have questions? Feel free to reply to this email or contact us at</p>
                    <p style="margin-top: 8px;">
                        <a href="mailto:careers@{{ str_replace(' ', '', strtolower($companyName)) }}.com"
                            style="color: #667eea; text-decoration: none;">
                            careers@{{ str_replace(' ', '', strtolower($companyName)) }}.com
                        </a>
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p>&copy; {{ date('Y') }} {{ $companyName }}. All rights reserved.</p>
                <p>This email was sent to you regarding your job application.</p>
                <ul class="social-links">
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">📘</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">🐦</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">💼</a></li>
                </ul>
            </div>
        </div>
    </div>
</body>

</html>
