'use client';

import { useState, useEffect } from 'react';
import SimpleTypewriter from '../ui/SimpleTypewriter';
import { apiService } from '@/lib/api-service';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useLocale } from '@/hooks/useLocale';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { dict } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Safe access to translations with fallbacks
  const t = {
    title: dict?.auth?.register_modal?.title || 'IDENTITY REGISTRATION',
    subtitle: dict?.auth?.register_modal?.subtitle || 'Create your credentials to access the laboratory',
    username_placeholder: dict?.auth?.register_modal?.username_placeholder || 'Username',
    email_placeholder: dict?.auth?.register_modal?.email_placeholder || 'Email Address',
    password_placeholder: dict?.auth?.register_modal?.password_placeholder || 'Password',
    confirm_password_placeholder: dict?.auth?.register_modal?.confirm_password_placeholder || 'Confirm Password',
    create_identity_button: dict?.auth?.register_modal?.create_identity_button || 'CREATE IDENTITY',
    creating_identity: dict?.auth?.register_modal?.creating_identity || 'CREATING IDENTITY...',
    registration_complete: dict?.auth?.register_modal?.registration_complete || 'Registration Complete. Welcome to the Lab.',
    creating_your_identity: dict?.auth?.register_modal?.creating_your_identity || 'Creating your identity...',
    password_mismatch: dict?.auth?.register_modal?.password_mismatch || 'Password confirmation does not match',
    password_too_short: dict?.auth?.register_modal?.password_too_short || 'Password must be at least 6 characters',
    registration_failed: dict?.auth?.register_modal?.registration_failed || 'Registration failed',
    minimum_characters: dict?.auth?.register_modal?.minimum_characters || 'MINIMUM 6 CHARACTERS',
    existing_identity: dict?.auth?.register_modal?.existing_identity || 'Existing identity? Sign in here →',
    cancel_registration: dict?.auth?.register_modal?.cancel_registration || 'Cancel Registration'
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  const modalRef = useClickOutside<HTMLDivElement>(onClose, isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t.password_mismatch);
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.password_too_short);
      setTimeout(() => setError(''), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(response.error || t.registration_failed);
        setTimeout(() => setError(''), 2000);
      }
    } catch (err: any) {
      setError(err.message || t.registration_failed);
      setTimeout(() => setError(''), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 relative">
            <div className="text-center">
              <div className="text-green-400 text-lg mb-4">
                <SimpleTypewriter
                  text={t.registration_complete}
                  speed={50}
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm">{t.creating_your_identity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFormValid = formData.name.trim() &&
    formData.email.trim() &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div ref={modalRef} className="bg-gray-900/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <div className="text-green-400 text-xl mb-2">
              {t.title}
            </div>
            <div className="text-gray-300 text-sm">
              {t.subtitle}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.username_placeholder}
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
                  }
                `}
                required
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.email_placeholder}
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
                  }
                `}
                required
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t.password_placeholder}
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
                  }
                `}
                required
              />
            </div>

            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t.confirm_password_placeholder}
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-yellow-500 focus:ring-yellow-500/50'
                      : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
                  }
                `}
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all duration-200
                ${isFormValid && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? t.creating_identity : t.create_identity_button}
            </button>
          </form>

          <div className="mt-4 space-y-3">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span>{t.minimum_characters}</span>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-green-400 hover:text-green-300 text-sm transition-colors"
              >
                {t.existing_identity}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                {t.cancel_registration}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}