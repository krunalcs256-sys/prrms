package com.demo.referral.controller;

import com.demo.referral.dto.request.BulkReferralRequest;
import com.demo.referral.dto.request.ReferralStatusRequest;
import com.demo.referral.dto.response.ApiResponse;
import com.demo.referral.dto.response.BulkReferralResponse;
import com.demo.referral.dto.response.ReferralResponse;
import com.demo.referral.security.UserPrincipal;
import com.demo.referral.service.ReferralService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class ReferralController {

    private final ReferralService referralService;

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<BulkReferralResponse>> bulkRefer(
            @Valid @RequestBody BulkReferralRequest request,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest httpRequest
    ) {
        String bearerToken = httpRequest.getHeader("Authorization");
        BulkReferralResponse result = referralService.createBulkReferrals(request, principal, bearerToken);
        return ResponseEntity.ok(ApiResponse.success(result, result.message()));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<ApiResponse<Page<ReferralResponse>>> getOutgoing(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Page<ReferralResponse> result = referralService.getOutgoingReferrals(
                principal.getUserId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/incoming")
    public ResponseEntity<ApiResponse<Page<ReferralResponse>>> getIncoming(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Page<ReferralResponse> result = referralService.getIncomingReferrals(
                principal.getUserId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReferralResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReferralStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ReferralResponse result = referralService.updateStatus(id, request, principal.getUserId());
        return ResponseEntity.ok(ApiResponse.success(result, "Referral status updated"));
    }
}