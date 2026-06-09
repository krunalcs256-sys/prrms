package com.demo.referral;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ReferralServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReferralServiceApplication.class, args);
    }
}