package com.ssafy.kdkd.controller;

import com.ssafy.kdkd.domain.dto.fund.FundDto;
import com.ssafy.kdkd.domain.dto.fund.FundReservationDto;
import com.ssafy.kdkd.domain.dto.fund.FundStatusDto;
import com.ssafy.kdkd.domain.dto.fund.RoiDto;
import com.ssafy.kdkd.domain.dto.fund.TransferDto;
import com.ssafy.kdkd.domain.entity.fund.Fund;
import com.ssafy.kdkd.domain.entity.fund.FundReservation;
import com.ssafy.kdkd.domain.entity.fund.Roi;
import com.ssafy.kdkd.service.fund.FundReservationService;
import com.ssafy.kdkd.service.fund.FundService;
import com.ssafy.kdkd.service.fund.FundStatusService;
import com.ssafy.kdkd.service.fund.RoiService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/fund")
public class FundController {

    private final FundService fundService;
    private final FundReservationService fundReservationService;
    private final FundStatusService fundStatusService;
    private final RoiService roiService;

    @PostMapping("/transfer")
    @Operation(summary = "코인계좌로 이체")
    public ResponseEntity<?> transfer(@RequestBody TransferDto transferDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: transfer() Enter");
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                boolean isOk = fundService.transfer(transferDto);

                if (!isOk) {
                    status = HttpStatus.NOT_ACCEPTABLE;
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @PostMapping("/child/submit")
    @Operation(summary = "투자 항목 아이 선택")
    public ResponseEntity<?> submitChild(@RequestBody FundStatusDto fundStatusDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: submitChild() Enter");
            Long childId = fundStatusDto.getChildId();
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                boolean isChild = true;
                boolean isRejected = fundStatusService.setFundStatus(fundStatusDto, isChild);

                if (isRejected) {
                    status = HttpStatus.NOT_ACCEPTABLE;
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @PostMapping("/parent/submit")
    @Operation(summary = "투자 항목 부모 선택")
    public ResponseEntity<?> submitParent(@RequestBody FundStatusDto fundStatusDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: submitParent() Enter");
            Long childId = fundStatusDto.getChildId();
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                boolean isChild = false;
                boolean isRejected = fundStatusService.setFundStatus(fundStatusDto, isChild);

                if (isRejected) {
                    status = HttpStatus.NO_CONTENT;
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @GetMapping("/confirm/{childId}")
    @Operation(summary = "투자 항목 조회")
    public ResponseEntity<?> confirmFund(@PathVariable("childId") Long childId, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.FOUND;
        try {
            log.info("fund controller: confirmFund() Enter");
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                // childId가 가진 fund 테이블 확인
                Optional<Fund> resultFund = fundService.findById(childId);
                if (resultFund.isEmpty()) {
                    status = HttpStatus.NO_CONTENT;
                } else {
                    resultMap.put("Fund", FundDto.mappingFundDto(resultFund.get()));
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @GetMapping("/reservation/confirm/{childId}")
    @Operation(summary = "투자 예약 조회")
    public ResponseEntity<?> confirmReservation(@PathVariable("childId") Long childId, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.FOUND;
        try {
            log.info("fund controller: confirmReservation() Enter");
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                // childId가 가진 fund_reservation 테이블 확인
                Optional<FundReservation> resultFundReservation = fundReservationService.findById(childId);
                if (resultFundReservation.isEmpty()) {
                    status = HttpStatus.NO_CONTENT;
                } else {
                    FundReservationDto fundReservationDto = FundReservationDto.mappingFundReservationDto(
                        resultFundReservation.get());
                    resultMap.put("FundReservation", fundReservationDto);
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @PostMapping("/create")
    @Operation(summary = "투자 항목 생성")
    public ResponseEntity<?> createFund(@RequestBody FundReservationDto fundReservationDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;
        try {
            log.info("fund controller: create-fund() Enter");
            Long childId = fundReservationDto.getChildId();
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                boolean type = false;
                FundReservationDto result = fundReservationService.createFundReservation(fundReservationDto, type);

                if (result == null) {
                    status = HttpStatus.CONFLICT;
                } else {
                    resultMap.put("Fund", result);
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @PostMapping("/reservation/create")
    @Operation(summary = "투자 예약 생성")
    public ResponseEntity<?> createReservation(@RequestBody FundReservationDto fundReservationDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;
        try {
            log.info("fund controller: create-reservation() Enter");
            Long childId = fundReservationDto.getChildId();
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                boolean type = false;
                FundReservationDto result = fundReservationService.createFundReservation(fundReservationDto, type);

                if (result == null) {
                    resultMap.put("FundReservation", result);
                } else {
                    status = HttpStatus.CONFLICT;
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @PutMapping("/reservation/modify")
    @Operation(summary = "투자 예약 수정")
    public ResponseEntity<?> modifyReservation(@RequestBody FundReservationDto fundReservationDto, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: modifyReservation() Enter");
            Long childId = fundReservationDto.getChildId();
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                FundReservationDto result =
                    fundReservationService.modifyFundReservation(childId, fundReservationDto);

                if (result == null) {
                    status = HttpStatus.NO_CONTENT;
                } else {
                    resultMap.put("FundReservation", result);
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @DeleteMapping("/reservation/delete/{childId}")
    @Operation(summary = "투자 예약 삭제")
    public ResponseEntity<?> deleteReservation(@PathVariable("childId") Long childId, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: deleteReservation() Enter");
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                boolean isEmpty = fundReservationService.delete(childId);

                if (isEmpty) {
                    status = HttpStatus.NO_CONTENT;
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @DeleteMapping("/delete/{childId}")
    @Operation(summary = "투자 항목 제거")
    public ResponseEntity<?> deleteFund(@PathVariable("childId") Long childId, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: deleteFund() Enter");
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                FundReservationDto result = fundReservationService.deleteFundReservation(childId);

                if (result == null) {
                    status = HttpStatus.NO_CONTENT;
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @GetMapping("/roi/{childId}")
    @Operation(summary = "투자 성공률 조회")
    public ResponseEntity<?> roi(@PathVariable("childId") Long childId, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("fund controller: roi() Enter");
            // 현재 childId에 대한 권한 확인
            boolean isValid = false;

            if (isValid) {
                status = HttpStatus.UNAUTHORIZED;
            } else {
                // childId가 가진 roi 테이블 확인
                Optional<Roi> result = roiService.findById(childId);

                if (result.isEmpty()) {
                    status = HttpStatus.NO_CONTENT;
                } else {
                    RoiDto roiDto = RoiDto.mappingRoiDto(result.get());
                    resultMap.put("roi", roiDto);
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

}
