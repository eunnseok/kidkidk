package com.ssafy.kdkd.domain.entity.deposit;

import com.ssafy.kdkd.domain.entity.user.Child;

import static jakarta.persistence.FetchType.LAZY;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "deposit")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Deposit {

    @Id
    @GeneratedValue
    @Column(name = "deposit_id")
    private Long id;

    @Column(name = "data_log")
    private LocalDateTime dataLog;

    @Column(name = "detail")
    private String detail;

    @Column(name = "type")
    private boolean type;

    @Column(name = "amount")
    private int amount;

    @Column(name = "money")
    private int money;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "child_id")
    private Child child;
}
