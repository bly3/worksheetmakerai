package com.workshopai.repository;

import com.workshopai.model.User;
import com.workshopai.model.Worksheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorksheetRepository extends JpaRepository<Worksheet, Long> {
    
    List<Worksheet> findByUser(User user);
    
    List<Worksheet> findByUserOrderByCreatedAtDesc(User user);
    
    List<Worksheet> findByUserAndQuestionTypeContainingIgnoreCase(User user, String questionType);
}
