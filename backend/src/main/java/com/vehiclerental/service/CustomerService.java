package com.vehiclerental.service;

import com.vehiclerental.exception.ResourceNotFoundException;
import com.vehiclerental.model.Customer;
import com.vehiclerental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public Customer findOrCreateByEmail(String name, String email, String phoneNumber) {
        return customerRepository.findByEmail(email).orElseGet(() -> {
            Customer c = new Customer();
            c.setName(name);
            c.setEmail(email);
            c.setPhoneNumber(phoneNumber);
            return customerRepository.save(c);
        });
    }

    public void deleteCustomer(Long id) {
        customerRepository.delete(findById(id));
    }
}
