import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { getPlatformSettings, updatePlatformSettings } from '@/services/superadminApi';
import { Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const data = await getPlatformSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await updatePlatformSettings(settings);
      window.alert('Success\n\nSettings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      window.alert('Error\n\nFailed to save settings');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading || !settings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your platform settings"
      />

      <div className="rounded-lg border bg-card p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.platformName || ''}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail || ''}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={settings.timezone || ''}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            >
              <option value="Asia/Jakarta">Asia/Jakarta</option>
              <option value="Asia/Bangkok">Asia/Bangkok</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={settings.currency || ''}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            >
              <option value="IDR">IDR (Indonesian Rupiah)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="SGD">SGD (Singapore Dollar)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
