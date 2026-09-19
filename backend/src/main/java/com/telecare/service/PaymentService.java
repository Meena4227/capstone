package com.telecare.service;

import com.telecare.dto.PaymentRequest;
import com.telecare.model.Appointment;
import com.telecare.model.Payment;
import com.telecare.repository.AppointmentRepository;
import com.telecare.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Payment processPayment(PaymentRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + request.getAppointmentId()));

        String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .appointment(appointment)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI")
                .paymentStatus("COMPLETED")
                .transactionId(txnId)
                .build();

        return paymentRepository.save(payment);
    }

    public Payment getPaymentByAppointmentId(Long appointmentId) {
        return paymentRepository.findByAppointment_AppointmentId(appointmentId).orElse(null);
    }
}
