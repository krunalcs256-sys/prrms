package com.demo.referral.dto.request;

import com.demo.referral.enums.ReferralStatus;
import jakarta.validation.constraints.NotNull;

public record ReferralStatusRequest(
        @NotNull ReferralStatus status
) {}