package com.campimove.backend.repositories;

import com.campimove.backend.entities.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findByRoomIdOrderByTimestampAsc(String roomId);
    @Query(value = "SELECT DISTINCT ON (room_id) room_id, sender_id, text, timestamp FROM chat_messages WHERE sender_id = :motoristId OR recipient_id = :motoristId ORDER BY room_id, timestamp DESC", nativeQuery = true)
    List<Object[]> findLastMessagesForMotorist(@Param("motoristId") String motoristId);
}