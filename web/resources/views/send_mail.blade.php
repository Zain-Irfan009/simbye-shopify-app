<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Detail</title>
</head>
<body>
<p>Dear {{ $details['name'] }},</p>

<p>This is the QR Code for your newly purchased eSIM:</p>

@php
    $esim_all_profile = json_decode($details['esim_all_profile']);
@endphp

@foreach($esim_all_profile as $profile)
    <img src="{{ $profile->qrCodeUrl }}" alt="QR Code" style="display: block; margin: 20px auto;">
    <p>You can also install the QR code manually from this shareable link:</p>
    <p><a href="{{ $profile->shortUrl }}">{{ $profile->shortUrl }}</a></p>
    @php
        // Format the expiration time
        $formattedExpiredTime = date('d/m/y', strtotime($profile->expiredTime));
    @endphp

    <p>Pre-Installation validity is 180 days. Please install before {{ $formattedExpiredTime }}.</p>
<p>After install, your eSIM is valid for 7 days</p>
    <p><strong>Installation video guide:</strong> No APN settings are required. Set your newly installed eSIM as your Data Line. Turn on "Data Roaming" in Cellular Settings after Install.</p>
    <p>For troubleshooting or top-up, your ICCID is: {{ $profile->iccid }}</p>
@endforeach

<p>Thank you!</p>
</body>
</html>
