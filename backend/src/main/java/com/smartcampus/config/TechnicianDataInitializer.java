package com.smartcampus.config;

import com.smartcampus.technicians.model.Technician;
import com.smartcampus.technicians.model.Technician.TechnicianStatus;
import com.smartcampus.technicians.repository.TechnicianRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TechnicianDataInitializer implements CommandLineRunner {
    
    private final TechnicianRepository technicianRepository;
    
    public TechnicianDataInitializer(TechnicianRepository technicianRepository) {
        this.technicianRepository = technicianRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Create sample technicians if they don't exist
        if (!technicianRepository.existsById(1L)) {
            Technician tech1 = new Technician();
            tech1.setId(1L);
            tech1.setName("John Smith");
            tech1.setEmail("john.smith@campus.edu");
            tech1.setPhone("555-0101");
            tech1.setSpecialization("Network Infrastructure");
            tech1.setDepartment("IT Support");
            tech1.setStatus(TechnicianStatus.ACTIVE);
            technicianRepository.save(tech1);
            System.out.println("Created technician: John Smith");
        }
        
        if (!technicianRepository.existsById(2L)) {
            Technician tech2 = new Technician();
            tech2.setId(2L);
            tech2.setName("Sarah Johnson");
            tech2.setEmail("sarah.johnson@campus.edu");
            tech2.setPhone("555-0102");
            tech2.setSpecialization("Hardware Maintenance");
            tech2.setDepartment("Facilities");
            tech2.setStatus(TechnicianStatus.ACTIVE);
            technicianRepository.save(tech2);
            System.out.println("Created technician: Sarah Johnson");
        }
        
        if (!technicianRepository.existsById(3L)) {
            Technician tech3 = new Technician();
            tech3.setId(3L);
            tech3.setName("Mike Wilson");
            tech3.setEmail("mike.wilson@campus.edu");
            tech3.setPhone("555-0103");
            tech3.setSpecialization("Software Support");
            tech3.setDepartment("IT Services");
            tech3.setStatus(TechnicianStatus.ACTIVE);
            technicianRepository.save(tech3);
            System.out.println("Created technician: Mike Wilson");
        }
        
        if (!technicianRepository.existsById(4L)) {
            Technician tech4 = new Technician();
            tech4.setId(4L);
            tech4.setName("Emily Davis");
            tech4.setEmail("emily.davis@campus.edu");
            tech4.setPhone("555-0104");
            tech4.setSpecialization("Electrical Systems");
            tech4.setDepartment("Maintenance");
            tech4.setStatus(TechnicianStatus.ON_LEAVE);
            technicianRepository.save(tech4);
            System.out.println("Created technician: Emily Davis (On Leave)");
        }
    }
}
