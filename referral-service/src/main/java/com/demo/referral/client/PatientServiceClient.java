package com.demo.referral.client;

import com.demo.referral.dto.response.ApiResponse;
import com.demo.referral.dto.response.PatientDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class PatientServiceClient {

    private final RestClient restClient;

    public PatientServiceClient(@Value("${services.patient.url}") String patientServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(patientServiceUrl)
                .build();
    }

    public List<PatientDto> getPatientsByIds(List<Long> ids, String bearerToken) {
        ApiResponse<List<PatientDto>> response = restClient.post()
                .uri("/api/patients/batch/by-ids")
                .header("Authorization", bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ids)
                .retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<PatientDto>>>() {});

        return response != null ? response.data() : List.of();
    }

    public void updatePatientStatuses(List<Long> patientIds, String status, String bearerToken) {
        restClient.patch()
                .uri("/api/patients/batch/status")
                .header("Authorization", bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("patientIds", patientIds, "status", status))
                .retrieve()
                .toBodilessEntity();
    }
}