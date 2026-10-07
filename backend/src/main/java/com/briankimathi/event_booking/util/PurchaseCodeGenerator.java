package com.briankimathi.event_booking.util;

import java.util.UUID;

public class PurchaseCodeGenerator {

    private PurchaseCodeGenerator() {}

    /**
     * Generates a unique ticket purchase code in the format: TKT-XXXXXXXX
     * e.g. TKT-3F9A1B2C
     */
    public static String generate() {
        String random = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, Constants.PURCHASE_CODE_RANDOM_LENGTH)
                .toUpperCase();
        return Constants.PURCHASE_CODE_PREFIX + random;
    }
}
