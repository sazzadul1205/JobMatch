{{-- resources/views/emails/shortlisted.blade.php --}}

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Congratulations! You've been Shortlisted</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            background-color: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #10b981, #059669);
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            color: #fff;
            margin: 0;
            font-size: 28px;
        }

        .header p {
            color: rgba(255, 255, 255, 0.9);
            margin: 10px 0 0;
        }

        .content {
            padding: 30px;
        }

        .job-details {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
        }

        .job-details h3 {
            margin: 0 0 10px;
            color: #065f46;
        }

        .message-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
        }

        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }

        .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }

        .info-item {
            margin: 10px 0;
        }

        .label {
            font-weight: bold;
            color: #4b5563;
            min-width: 100px;
            display: inline-block;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>You've been shortlisted for the position</p>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $application->applicant_name }}</strong>,</p>

            <p>Thank you for your interest in joining our team. After carefully reviewing your application, we are
                pleased to inform you that you have been <strong style="color: #10b981;">SHORTLISTED</strong> for the
                position.</p>

            <div class="job-details">
                <h3>📋 Position Details</h3>
                <p><strong>Position:</strong> {{ $application->jobListing->title }}</p>
                <p><strong>Company:</strong> {{ $application->jobListing->user->name ?? 'Our Company' }}</p>
                <p><strong>Application ID:</strong> #{{ $application->id }}</p>
            </div>

            <div class="message-box">
                <h3>📝 Important Information</h3>
                {!! nl2br(e($customMessage)) !!}
            </div>

            <p>Our recruitment team will contact you shortly with further details about the next steps.</p>

            <p>If you have any questions, please don't hesitate to contact us.</p>

            <p>Best regards,<br>
                <strong>Recruitment Team</strong>
            </p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
