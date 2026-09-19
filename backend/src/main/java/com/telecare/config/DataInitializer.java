package com.telecare.config;

import com.telecare.model.*;
import com.telecare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (doctorRepository.count() > 0) {
            return;
        }

        // 1. Departments
        Department gm = departmentRepository.save(Department.builder().name("General Medicine").description("Primary healthcare and general medicine diagnosis").icon("🩺").build());
        Department cardio = departmentRepository.save(Department.builder().name("Cardiologist").description("Specialist in heart health and cardiovascular care").icon("❤️").build());
        Department derma = departmentRepository.save(Department.builder().name("Dermatologist").description("Specialist in skin, hair and dermatological care").icon("🧴").build());
        Department neuro = departmentRepository.save(Department.builder().name("Neurologist").description("Specialist in neurological diagnosis and brain health").icon("🧠").build());
        Department pedia = departmentRepository.save(Department.builder().name("Pediatrician").description("Comprehensive healthcare for infants, children, and adolescents").icon("👶").build());

        // 2. Doctors
        String defaultPw = passwordEncoder.encode("password123");

        Doctor anjali = doctorRepository.save(Doctor.builder()
                .name("Dr. Anjali Rao")
                .email("doctor.anjali@telecare.com")
                .phone("+91 9845012345")
                .password(defaultPw)
                .specialization("General Medicine")
                .licenseNo("MCI-2016-89421")
                .qualification("MBBS, MD (General Medicine)")
                .experienceYears(8)
                .about("Experienced physician providing quality primary healthcare, preventive medicine, and compassionate telemedicine consultations.")
                .rating(4.8)
                .fee(500.0)
                .available(true)
                .avatar("👩‍⚕️")
                .departments(Set.of(gm))
                .build());

        Doctor arun = doctorRepository.save(Doctor.builder()
                .name("Dr. Arun Kumar")
                .email("doctor.arun@telecare.com")
                .phone("+91 9845023456")
                .password(defaultPw)
                .specialization("Cardiologist")
                .licenseNo("MCI-2012-45123")
                .qualification("MBBS, MD, DM (Cardiology)")
                .experienceYears(12)
                .about("Specialist in heart health, preventive cardiovascular care, hypertension management, and lifestyle cardiology.")
                .rating(4.9)
                .fee(700.0)
                .available(true)
                .avatar("👨‍⚕️")
                .departments(Set.of(cardio))
                .build());

        Doctor priya = doctorRepository.save(Doctor.builder()
                .name("Dr. Priya Sharma")
                .email("doctor.priya@telecare.com")
                .phone("+91 9845034567")
                .password(defaultPw)
                .specialization("Dermatologist")
                .licenseNo("MCI-2017-78912")
                .qualification("MBBS, MD (Dermatology)")
                .experienceYears(7)
                .about("Specialist in clinical dermatology, skin rejuvenation, acne treatments, hair care, and allergy diagnosis.")
                .rating(4.7)
                .fee(600.0)
                .available(true)
                .avatar("👩‍⚕️")
                .departments(Set.of(derma))
                .build());

        Doctor rahul = doctorRepository.save(Doctor.builder()
                .name("Dr. Rahul Menon")
                .email("doctor.rahul@telecare.com")
                .phone("+91 9845045678")
                .password(defaultPw)
                .specialization("Neurologist")
                .licenseNo("MCI-2014-63219")
                .qualification("MBBS, MD, DM (Neurology)")
                .experienceYears(10)
                .about("Expert in neurological diagnosis, migraine management, peripheral nerve care, and neuro-rehabilitation.")
                .rating(4.8)
                .fee(800.0)
                .available(true)
                .avatar("👨‍⚕️")
                .departments(Set.of(neuro))
                .build());

        // 3. Patients
        Patient meena = patientRepository.save(Patient.builder()
                .name("Meena Sekar")
                .email("patient@telecare.com")
                .phone("+91 9876543210")
                .password(defaultPw)
                .dob(LocalDate.of(1998, 5, 14))
                .gender("Female")
                .address("42 Green Valley Ave, Bangalore")
                .bloodGroup("O+")
                .weight("60 kg")
                .heartRate("78 bpm")
                .temperature("98.6°F")
                .build());

        Patient patientArun = patientRepository.save(Patient.builder()
                .name("Arun Kumar")
                .email("patient.arun@telecare.com")
                .phone("+91 9123456780")
                .password(defaultPw)
                .dob(LocalDate.of(1992, 8, 20))
                .gender("Male")
                .address("15 Richmond Road, Bangalore")
                .bloodGroup("B+")
                .weight("72 kg")
                .heartRate("74 bpm")
                .temperature("98.4°F")
                .build());

        Patient patientPriya = patientRepository.save(Patient.builder()
                .name("Priya Sharma")
                .email("patient.priya@telecare.com")
                .phone("+91 9123456781")
                .password(defaultPw)
                .dob(LocalDate.of(1995, 3, 11))
                .gender("Female")
                .address("88 Indiranagar, Bangalore")
                .bloodGroup("A+")
                .weight("55 kg")
                .heartRate("76 bpm")
                .temperature("98.5°F")
                .build());

        // 4. Appointments
        // Today's upcoming appointment with Dr. Anjali
        Appointment appt1 = appointmentRepository.save(Appointment.builder()
                .patient(meena)
                .doctor(anjali)
                .appointmentDate(LocalDate.now())
                .appointmentTime("10:30 AM")
                .consultationType("VIDEO")
                .reason("Mild fever and common cold symptoms")
                .status("CONFIRMED")
                .fee(500.0)
                .build());

        // Appointment 2 for Dr. Anjali (Arun Kumar)
        appointmentRepository.save(Appointment.builder()
                .patient(patientArun)
                .doctor(anjali)
                .appointmentDate(LocalDate.now())
                .appointmentTime("12:00 PM")
                .consultationType("VIDEO")
                .reason("Follow-up Consultation")
                .status("CONFIRMED")
                .fee(500.0)
                .build());

        // Appointment 3 for Dr. Anjali (Priya Sharma)
        appointmentRepository.save(Appointment.builder()
                .patient(patientPriya)
                .doctor(anjali)
                .appointmentDate(LocalDate.now())
                .appointmentTime("03:30 PM")
                .consultationType("VIDEO")
                .reason("Skin rash checkup")
                .status("WAITING")
                .fee(500.0)
                .build());

        // Past Appointment 1 (Routine cardiology check)
        Appointment pastAppt1 = appointmentRepository.save(Appointment.builder()
                .patient(meena)
                .doctor(arun)
                .appointmentDate(LocalDate.now().minusDays(7))
                .appointmentTime("02:00 PM")
                .consultationType("VIDEO")
                .reason("Routine cardiovascular health checkup")
                .status("COMPLETED")
                .fee(700.0)
                .build());

        // Past Appointment 2 (Dermatology consult)
        Appointment pastAppt2 = appointmentRepository.save(Appointment.builder()
                .patient(meena)
                .doctor(priya)
                .appointmentDate(LocalDate.now().minusDays(15))
                .appointmentTime("11:00 AM")
                .consultationType("VIDEO")
                .reason("Skin allergy and dryness consultation")
                .status("COMPLETED")
                .fee(600.0)
                .build());

        // 5. Consultations
        Consultation consult1 = consultationRepository.save(Consultation.builder()
                .appointment(appt1)
                .type("Video")
                .diagnosis("Mild fever and common cold symptoms")
                .notes("Patient advised to hydrate well, avoid physical strain, and monitor temperature.")
                .status("IN_PROGRESS")
                .startTime(LocalDateTime.now().minusMinutes(14))
                .build());

        Consultation pastConsult1 = consultationRepository.save(Consultation.builder()
                .appointment(pastAppt1)
                .type("Video")
                .diagnosis("Routine Check-up: Blood pressure normal (118/78), ECG normal")
                .notes("Maintain moderate aerobic exercises 30 mins a day.")
                .status("COMPLETED")
                .startTime(LocalDateTime.now().minusDays(7))
                .endTime(LocalDateTime.now().minusDays(7).plusMinutes(25))
                .build());

        Consultation pastConsult2 = consultationRepository.save(Consultation.builder()
                .appointment(pastAppt2)
                .type("Video")
                .diagnosis("Mild Contact Dermatitis")
                .notes("Avoid harsh chemical soaps, apply moisturizer regularly.")
                .status("COMPLETED")
                .startTime(LocalDateTime.now().minusDays(15))
                .endTime(LocalDateTime.now().minusDays(15).plusMinutes(20))
                .build());

        // 6. Prescriptions
        Prescription rx = Prescription.builder()
                .consultation(consult1)
                .prescriptionCode("TC-2026-001")
                .diagnosis("Mild fever and common cold symptoms")
                .instructions("Drink plenty of water. Take adequate rest. Maintain a healthy diet. Avoid unnecessary physical stress.")
                .followUpDate(LocalDate.now().plusDays(7))
                .build();

        List<PrescriptionItem> rxItems = new ArrayList<>();
        rxItems.add(PrescriptionItem.builder().prescription(rx).medicineName("Paracetamol 500mg").dosage("1 tablet × 2/day").frequency("Twice a day").duration("3 Days").build());
        rxItems.add(PrescriptionItem.builder().prescription(rx).medicineName("Cetirizine 10mg").dosage("1 tablet at night").frequency("Once a day").duration("5 Days").build());
        rxItems.add(PrescriptionItem.builder().prescription(rx).medicineName("Vitamin C").dosage("1 tablet/day").frequency("Once a day").duration("7 Days").build());
        rx.setItems(rxItems);
        prescriptionRepository.save(rx);

        // 7. Medical Records for Meena
        medicalRecordRepository.save(MedicalRecord.builder()
                .patient(meena)
                .diagnosis("Mild fever and common cold")
                .allergies("None reported")
                .chronicConditions("None")
                .surgicalHistory("None")
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .patient(meena)
                .diagnosis("Routine Cardiovascular Screening - Healthy")
                .allergies("None reported")
                .chronicConditions("None")
                .surgicalHistory("None")
                .build());

        // 8. Chat Messages for consult1
        chatMessageRepository.save(ChatMessage.builder()
                .consultationId(consult1.getConsultationId())
                .senderRole("DOCTOR")
                .senderName("Dr. Anjali Rao")
                .content("Hello! 👋 How are you feeling today?")
                .build());

        chatMessageRepository.save(ChatMessage.builder()
                .consultationId(consult1.getConsultationId())
                .senderRole("PATIENT")
                .senderName("Meena Sekar")
                .content("Hello Doctor! I'm feeling a little uncomfortable today with mild fever and cold.")
                .build());

        chatMessageRepository.save(ChatMessage.builder()
                .consultationId(consult1.getConsultationId())
                .senderRole("DOCTOR")
                .senderName("Dr. Anjali Rao")
                .content("Okay. Please tell me more about your symptoms and since when you noticed them.")
                .build());
    }
}
