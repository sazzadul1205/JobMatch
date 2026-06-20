{{-- resources/views/emails/password-reset.blade.php --}}

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Reset your password' }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1f2937;
        }

        .wrapper {
            width: 100%;
            padding: 32px 16px;
        }

        .card {
            max-width: 640px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .header {
            background: linear-gradient(135deg, #7c2d12 0%, #ea580c 100%);
            padding: 40px 32px;
            text-align: center;
            color: #ffffff;
        }

        .badge {
            display: inline-block;
            padding: 8px 14px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.14);
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 16px;
        }

        .header h1 {
            margin: 0;
            font-size: 30px;
            line-height: 1.2;
        }

        .header p {
            margin: 12px 0 0;
            color: rgba(255, 255, 255, 0.88);
            font-size: 15px;
        }

        .content {
            padding: 36px 32px 32px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 16px;
        }

        .text {
            font-size: 15px;
            line-height: 1.8;
            color: #4b5563;
            margin: 0 0 16px;
        }

        .panel {
            background: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
        }

        .panel-title {
            margin: 0 0 10px;
            font-size: 14px;
            font-weight: 700;
            color: #9a3412;
        }

        .details {
            font-size: 14px;
            line-height: 1.7;
            color: #7c2d12;
        }

        .button {
            display: inline-block;
            margin: 24px 0 12px;
            padding: 14px 24px;
            border-radius: 10px;
            background: #ea580c;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 600;
        }

        .link {
            color: #c2410c;
            word-break: break-all;
        }

        .footer {
            padding: 24px 32px 32px;
            border-top: 1px solid #e5e7eb;
            background: #fafafa;
            text-align: center;
            font-size: 12px;
            line-height: 1.7;
            color: #6b7280;
        }

        .footer strong {
            color: #374151;
        }

        @media (max-width: 600px) {
            .header,
            .content,
            .footer {
                padding-left: 20px;
                padding-right: 20px;
            }

            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <div class="badge">Password Reset</div>
                <h1>Reset your password</h1>
                <p>A secure link has been created to help you choose a new password.</p>
            </div>

            <div class="content">
                <p class="greeting">Hello {{ $userName ?? 'there' }},</p>

                <p class="text">
                    We received a request to reset the password for your {{ $appName ?? config('app.name') }} account.
                    If this was you, click the button below to continue.
                </p>

                <div style="text-align: center;">
                    <a href="{{ $resetUrl ?? '#' }}" class="button">Reset Password</a>
                </div>

                <div class="panel">
                    <p class="panel-title">Important</p>
                    <div class="details">
                        For your security, this link should only be used once and may expire after a limited time.
                        If you did not request a password reset, you can safely ignore this message.
                    </div>
                </div>

                <p class="text">
                    If the button does not work, copy and paste this link into your browser:
                </p>

                <p class="text">
                    <a href="{{ $resetUrl ?? '#' }}" class="link">{{ $resetUrl ?? '#' }}</a>
                </p>

                <p class="text" style="margin-bottom: 0;">
                    Best regards,<br>
                    <strong>{{ $appName ?? config('app.name') }}</strong>
                </p>
            </div>

            <div class="footer">
                <div><strong>{{ $appName ?? config('app.name') }}</strong></div>
                <div>This is an automated message. Please do not reply to this email.</div>
                <div>&copy; {{ date('Y') }} {{ $appName ?? config('app.name') }}. All rights reserved.</div>
            </div>
        </div>
    </div>
</body>

</html>
