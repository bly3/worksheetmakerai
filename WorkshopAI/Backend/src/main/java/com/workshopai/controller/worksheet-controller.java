package com.workshopai.controller;

import com.workshopai.model.User;
import com.workshopai.model.Worksheet;
import com.workshopai.payload.request.WorksheetRequest;
import com.workshopai.payload.response.MessageResponse;
import com.workshopai.repository.UserRepository;
import com.workshopai.repository.WorksheetRepository;
import com.workshopai.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/worksheets")
public class WorksheetController {
    
    @Autowired
    WorksheetRepository worksheetRepository;
    
    @Autowired
    UserRepository userRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Worksheet>> getAllWorksheets() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Worksheet> worksheets = worksheetRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(worksheets);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Worksheet> getWorksheetById(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Worksheet worksheet = worksheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worksheet not found"));
        
        // Check if the worksheet belongs to the current user
        if (!worksheet.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(worksheet);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createWorksheet(@Valid @RequestBody WorksheetRequest worksheetRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Worksheet worksheet = new Worksheet();
        worksheet.setTitle(worksheetRequest.getTitle());
        worksheet.setDescription(worksheetRequest.getDescription());
        worksheet.setYoutubeUrl(worksheetRequest.getYoutubeUrl());
        worksheet.setQuestionType(worksheetRequest.getQuestionType());
        worksheet.setNumberOfQuestions(worksheetRequest.getNumberOfQuestions());
        worksheet.setDifficultyLevel(worksheetRequest.getDifficultyLevel());
        worksheet.setOutputFormat(worksheetRequest.getOutputFormat());
        worksheet.setAdditionalInstructions(worksheetRequest.getAdditionalInstructions());
        worksheet.setWorksheetContent(worksheetRequest.getWorksheetContent());
        worksheet.setAnswerKey(worksheetRequest.getAnswerKey());
        worksheet.setUser(user);
        
        worksheetRepository.save(worksheet);
        
        return ResponseEntity.ok(new MessageResponse("Worksheet created successfully!"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateWorksheet(@PathVariable Long id, @Valid @RequestBody WorksheetRequest worksheetRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Worksheet worksheet = worksheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worksheet not found"));
        
        // Check if the worksheet belongs to the current user
        if (!worksheet.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        worksheet.setTitle(worksheetRequest.getTitle());
        worksheet.setDescription(worksheetRequest.getDescription());
        worksheet.setYoutubeUrl(worksheetRequest.getYoutubeUrl());
        worksheet.setQuestionType(worksheetRequest.getQuestionType());
        worksheet.setNumberOfQuestions(worksheetRequest.getNumberOfQuestions());
        worksheet.setDifficultyLevel(worksheetRequest.getDifficultyLevel());
        worksheet.setOutputFormat(worksheetRequest.getOutputFormat());
        worksheet.setAdditionalInstructions(worksheetRequest.getAdditionalInstructions());
        worksheet.setWorksheetContent(worksheetRequest.getWorksheetContent());
        worksheet.setAnswerKey(worksheetRequest.getAnswerKey());
        
        worksheetRepository.save(worksheet);
        
        return ResponseEntity.ok(new MessageResponse("Worksheet updated successfully!"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteWorksheet(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Worksheet worksheet = worksheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worksheet not found"));
        
        // Check if the worksheet belongs to the current user
        if (!worksheet.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        worksheetRepository.delete(worksheet);
        
        return ResponseEntity.ok(new MessageResponse("Worksheet deleted successfully!"));
    }
    
    @GetMapping("/filter")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Worksheet>> filterWorksheets(@RequestParam String questionType) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Worksheet> worksheets = worksheetRepository.findByUserAndQuestionTypeContainingIgnoreCase(user, questionType);
        return ResponseEntity.ok(worksheets);
    }
}
