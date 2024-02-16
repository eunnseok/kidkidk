package com.ssafy.kdkd.domain.dto.saving;

import com.ssafy.kdkd.domain.entity.saving.Saving;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SavingDto {

    private LocalDateTime startDate;
    private int count;
    private int payment;
    private int rate;
    private Long childId;

    public static SavingDto mappingSavingDto(Saving saving) {
        return SavingDto.builder()
            .startDate(saving.getStartDate())
            .count(saving.getCount())
            .payment(saving.getPayment())
            .rate(saving.getRate())
            .childId(saving.getId())
            .build();
    }

    public void updateSavingDto(int count, int rate) {
        this.startDate = LocalDateTime.now();
        this.count = count;
        this.rate = rate;
    }

}
