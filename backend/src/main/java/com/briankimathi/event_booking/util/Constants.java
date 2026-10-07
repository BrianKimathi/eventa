package com.briankimathi.event_booking.util;

public class Constants {

    private Constants() {}

    // Roles
    public static final String ROLE_USER = "USER";
    public static final String ROLE_CREATOR = "CREATOR";
    public static final String ROLE_ADMIN = "ADMIN";

    // Purchase code
    public static final String PURCHASE_CODE_PREFIX = "TKT-";
    public static final int PURCHASE_CODE_RANDOM_LENGTH = 8;

    // Default commission
    public static final double DEFAULT_COMMISSION_RATE = 10.0;

    // QR Code dimensions
    public static final int QR_CODE_WIDTH = 250;
    public static final int QR_CODE_HEIGHT = 250;

    // Email subjects
    public static final String EMAIL_SUBJECT_TICKET_CONFIRMATION = "Ticket Confirmation";
    public static final String EMAIL_SUBJECT_EVENT_APPROVED = "Your Event Has Been Approved";
    public static final String EMAIL_SUBJECT_EVENT_REJECTED = "Your Event Submission Was Not Approved";

    // Pagination defaults
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;
}
