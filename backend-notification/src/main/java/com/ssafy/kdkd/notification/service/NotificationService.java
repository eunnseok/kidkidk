package com.ssafy.kdkd.notification.service;

import com.ssafy.kdkd.notification.dto.NotificationMessageDto;
import com.ssafy.kdkd.notification.entity.NotificationMessage;
import com.ssafy.kdkd.notification.repository.EmitterRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;

import static com.ssafy.kdkd.notification.controller.NotificationController.DEFAULT_TIMEOUT;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {
    private final KafkaTemplate<String, NotificationMessage> kafkaTemplate;
    private final EmitterRepository emitterRepository;

    private String makeTimeIncludeId(String userId){
        return userId+"_"+System.currentTimeMillis();
    }

    private void sendToClient(SseEmitter emitter, String eventId, String emitterId, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(eventId)
                    .data(data));
            log.info("Kafka로 부터 전달 받은 메세지 전송. eventId : {},  emitterId : {}, message : {}", eventId, emitterId, data);
        } catch (IOException e) {
            emitterRepository.deleteById(emitterId);
            log.error("메시지 전송 에러 : {}", e);
        }
    }

    private boolean hasLostData(String lastEventId){
        return !lastEventId.isEmpty();
    }

    private void sendLostData(String lastEventId, String userId, String emitterId, SseEmitter emitter){
        Map<String, Object> eventCaches = emitterRepository.findAllEventCacheStartWithById(userId);
        System.out.println(eventCaches.size());
        eventCaches.entrySet().stream()
                .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                .forEach(entry -> sendToClient(emitter, entry.getKey(), emitterId, entry.getValue()));
    }

    public SseEmitter subscribe(String userId, String lastEventId, HttpServletResponse response) {
        String emitterId = makeTimeIncludeId(userId);
        SseEmitter emitter = emitterRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT));
//        response.setHeader("X-Accel-Buffering", "no");
        log.info("emitterId : {} 사용자 emitter 연결 ", emitterId);

        emitter.onCompletion(() -> {
            log.info("onCompletion callback");
            emitterRepository.deleteById(emitterId);
        });
        emitter.onTimeout(() -> {
            log.info("onTimeout callback");
            emitterRepository.deleteById(emitterId);
        });

        String eventId = makeTimeIncludeId(userId);
        sendToClient(emitter, eventId, emitterId, "connected!"); // 503 에러방지 더미 데이터

        if (hasLostData(lastEventId)) {
            sendLostData(lastEventId,userId,emitterId,emitter);
        }
        return emitter;
    }



//    @KafkaListener(topics = "notification", groupId = "group_1")
//    public void listen(NotificationMessage message) {
//        String receiverId = message.getUserId();
//
//        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithById(receiverId);
//        sseEmitters.forEach(
//                (key, emitter) -> {
//                    emitterRepository.saveEventCache(key, message);
//                    sendToClient(emitter, key, message);
//                }
//        );
//    }

    @KafkaListener(topics = "notification", groupId = "group_1")
    public void listen(NotificationMessage notification) {
        String receiverId = notification.getSubId();
        String eventId = makeTimeIncludeId(receiverId);
        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithById(receiverId);
        sseEmitters.forEach(
                (emitterId, emitter) -> {
                    emitterRepository.saveEventCache(emitterId, notification);
                    sendToClient(emitter, eventId, emitterId, notification);
                }
        );
    }



    public void publish(NotificationMessageDto msg) {
        NotificationMessage notificationMessage = NotificationMessage.builder()
                .subId(msg.getSubId()).pubName(msg.getPubName()).title(msg.getTitle()).content(msg.getContent())
                .key(makeTimeIncludeId(msg.getSubId())).require(msg.getRequire())
                .childId(msg.getChildId()).amount(msg.getAmount()).build();
        log.info("알림 전송. userId : {}, message : {}, sub_message : {}",msg.getSubId(), msg.getTitle(), msg.getContent());
        kafkaTemplate.send("notification", notificationMessage);
    }

    @Scheduled(fixedRate = 180000) // 3분마다 heartbeat 메세지 전달.
    public void sendHeartbeat() {
        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitters();
        sseEmitters.forEach((key, emitter) -> {
            try {
                emitter.send(SseEmitter.event().id(key).name("heartbeat").data(""));
                log.info("하트비트 메세지 전송");
            } catch (IOException e) {
                emitterRepository.deleteById(key);
                log.error("하트비트 전송 실패: {}", e.getMessage());
            }
        });
    }
}
