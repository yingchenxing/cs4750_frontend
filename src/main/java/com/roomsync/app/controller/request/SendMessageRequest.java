package com.roomsync.app.controller.request;

import com.roomsync.app.model.User;

public class SendMessageRequest {
    private User sender;
    private User receiver;
    private String content;

    // Constructors (at least a default no-arg constructor)
    public SendMessageRequest() {
    }

    public SendMessageRequest(User sender, User receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }

    // Getters and setters
    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}