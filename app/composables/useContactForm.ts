import { ref, reactive } from 'vue';

export const useContactForm = () => {
  const isSubmitting = ref(false);
  const submitSuccess = ref(false);
  const submitError = ref('');

  const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const errors = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    errors.name = '';
    errors.email = '';
    errors.subject = '';
    errors.message = '';

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate subject
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters';
      isValid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    return isValid;
  };

  const resetForm = () => {
    formData.name = '';
    formData.email = '';
    formData.subject = '';
    formData.message = '';
    errors.name = '';
    errors.email = '';
    errors.subject = '';
    errors.message = '';
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    isSubmitting.value = true;
    submitError.value = '';
    submitSuccess.value = false;

    try {
      // Create mailto link as fallback
      const mailtoLink = `mailto:cesargomezh90@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      )}`;

      // Open mailto link
      window.location.href = mailtoLink;

      // Simulate success after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      submitSuccess.value = true;
      resetForm();

      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      submitError.value = 'Failed to send message. Please try again or contact directly via email.';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    validateForm,
    submitForm,
    resetForm,
  };
};
