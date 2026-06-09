package com.demo.referral.dto.response;

import java.util.List;

public record BulkReferralResponse(
        int referralCount,
        String message,
        List<ReferralResponse> referrals
) {}