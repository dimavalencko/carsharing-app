import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { profileService } from '@/shared/api/profile/profile.service';
import type {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  DriverLicense,
  AddDriverLicenseDto,
  UpdateDriverLicenseDto,
} from '@/shared/types';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<UserProfile | null>(null);
  const license = ref<DriverLicense | null>(null);
  const loading = ref(false);
  const saving = ref(false);
  const licenseLoading = ref(false);
  const error = ref<string | null>(null);

  const hasLicense = computed(() => !!license.value && !license.value.isExpired);

  async function fetchProfile() {
    loading.value = true;
    error.value = null;
    try {
      profile.value = await profileService.getProfile();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки профиля';
    } finally {
      loading.value = false;
    }
  }

  async function fetchLicense() {
    licenseLoading.value = true;
    try {
      license.value = await profileService.getDriverLicense();
    } finally {
      licenseLoading.value = false;
    }
  }

  async function updateProfile(dto: UpdateProfileDto) {
    saving.value = true;
    error.value = null;
    try {
      profile.value = await profileService.updateProfile(dto);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка сохранения';
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function changePassword(dto: ChangePasswordDto) {
    saving.value = true;
    error.value = null;
    try {
      await profileService.changePassword(dto);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка смены пароля';
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function addLicense(dto: AddDriverLicenseDto) {
    licenseLoading.value = true;
    error.value = null;
    try {
      license.value = await profileService.addDriverLicense(dto);
      if (profile.value) profile.value.hasDriverLicense = true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка добавления прав';
      throw e;
    } finally {
      licenseLoading.value = false;
    }
  }

  async function updateLicense(dto: UpdateDriverLicenseDto) {
    licenseLoading.value = true;
    error.value = null;
    try {
      license.value = await profileService.updateDriverLicense(dto);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка обновления прав';
      throw e;
    } finally {
      licenseLoading.value = false;
    }
  }

  async function deleteLicense() {
    licenseLoading.value = true;
    error.value = null;
    try {
      await profileService.deleteDriverLicense();
      license.value = null;
      if (profile.value) profile.value.hasDriverLicense = false;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка удаления прав';
      throw e;
    } finally {
      licenseLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    profile,
    license,
    loading,
    saving,
    licenseLoading,
    error,
    hasLicense,
    fetchProfile,
    fetchLicense,
    updateProfile,
    changePassword,
    addLicense,
    updateLicense,
    deleteLicense,
    clearError,
  };
});
