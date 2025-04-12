package com.roomsync.app.repository;
import org.springframework.stereotype.*;
import org.springframework.data.jpa.repository.*;
import com.roomsync.app.model.Message;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}

