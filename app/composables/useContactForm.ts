import { ref, reactive } from 'vue';

const NETLIFY_FORM_NAME = 'portfolio-contact';

const FIELD_ORDER = ['name', 'email', 'subject', 'message'] as const;

type FieldKey = (typeof FIELD_ORDER)[number];

export const useContactForm = () => {
  const { t } = useI18n();
  const runtimeConfig = useRuntimeConfig();
  const isSubmitting = ref(false);
  const submitSuccess = ref(false);
  const submitError = ref('');

  const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const errors = reactive<Record<FieldKey, string>>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const clearErrors = () => {
    for (const key of FIELD_ORDER) {
      errors[key] = '';
    }
  };

  const focusFirstError = () => {
    if (!import.meta.client) return;

    const firstInvalid = FIELD_ORDER.find((key) => errors[key]);
    if (!firstInvalid) return;

    document.getElementById(`contact-${firstInvalid}`)?.focus();
  };

  const validateForm = (): boolean => {
    clearErrors();
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = t('contact.form.errors.nameRequired');
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = t('contact.form.errors.nameMin');
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = t('contact.form.errors.emailRequired');
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = t('contact.form.errors.emailInvalid');
      isValid = false;
    }

    if (!formData.subject.trim()) {
      errors.subject = t('contact.form.errors.subjectRequired');
      isValid = false;
    } else if (formData.subject.trim().length < 3) {
      errors.subject = t('contact.form.errors.subjectMin');
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = t('contact.form.errors.messageRequired');
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = t('contact.form.errors.messageMin');
      isValid = false;
    }

    return isValid;
  };

  const resetForm = () => {
    formData.name = '';
    formData.email = '';
    formData.subject = '';
    formData.message = '';
    clearErrors();
  };

  const submitViaMailto = (): void => {
    const mailtoLink = `mailto:cesargomezh90@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    )}`;
    window.location.href = mailtoLink;
  };

  const submitViaNetlify = async (): Promise<boolean> => {
    const base = runtimeConfig.app.baseURL.replace(/\/$/, '');
    const endpoint = `${base}/netlify-forms.html`;

    const body = new URLSearchParams({
      'form-name': NETLIFY_FORM_NAME,
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      'bot-field': '',
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    return response.ok;
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) {
      focusFirstError();
      return false;
    }

    isSubmitting.value = true;
    submitError.value = '';
    submitSuccess.value = false;

    try {
      const useNetlify = import.meta.client && runtimeConfig.public.contactProvider === 'netlify';

      if (useNetlify) {
        const sent = await submitViaNetlify();
        if (!sent) {
          submitError.value = t('contact.form.error');
          return false;
        }
      } else {
        submitViaMailto();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      submitSuccess.value = true;
      resetForm();

      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      submitError.value = t('contact.form.error');
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
