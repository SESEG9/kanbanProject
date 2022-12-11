package at.ac.tuwien.sese.g09.service.errors;

import java.io.IOException;
import java.io.UncheckedIOException;

public class PDFGenerationFailureException extends UncheckedIOException {

    public PDFGenerationFailureException(String message, IOException cause) {
        super(message, cause);
    }

    public PDFGenerationFailureException(IOException cause) {
        super(cause);
    }
}
