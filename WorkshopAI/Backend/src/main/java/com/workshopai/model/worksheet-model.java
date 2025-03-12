package com.workshopai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "worksheets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Worksheet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String youtubeUrl;
    
    @Column(nullable = false)
    private String questionType;
    
    @Column(nullable = false)
    private Integer numberOfQuestions;
    
    @Column(nullable = false)
    private String difficultyLevel;
    
    @Column(nullable = false)
    private String outputFormat;
    
    @Column(length = 2000)
    private String additionalInstructions;
    
    @Column(columnDefinition = "TEXT")
    private String worksheetContent;
    
    @Column(columnDefinition = "TEXT")
    private String answerKey;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
