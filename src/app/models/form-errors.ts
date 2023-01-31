export class FormErrors {
    nameErrorMessage: string;
    passwordErrorMessage: string;
    emailErrorMessage: string;
    isNameInvalid: boolean;
    isPasswordInvalid: boolean;
    isEmailInvalid: boolean;
    submitErrorMessage: string;
    isSubmitError: boolean;

    constructor() {
        this.nameErrorMessage = '';
        this.passwordErrorMessage = '';
        this.emailErrorMessage = '';
        this.submitErrorMessage = '';
        this.isNameInvalid = false;
        this.isPasswordInvalid = false;
        this.isEmailInvalid = false;
        this.isSubmitError = false;
    }
}
