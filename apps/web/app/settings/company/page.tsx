'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { timezones } from '@/lib/timezones';
import { countries } from '@/lib/countries';
import { getStatesForCountry, needsStateDropdown } from '@/lib/states';
import { companyUpdateSchema, type CompanyUpdateInput } from '@/lib/validation';
import { useToast } from '@/lib/toast';

interface CompanyData {
  name: string;
  timezone: string;
  business_address?: string;
  business_address_street?: string;
  business_address_city?: string;
  business_address_state?: string;
  business_address_postal_code?: string;
  business_address_country?: string;
  phone?: string;
  website?: string;
  tax_id?: string;
  logo_url?: string | null;
  id?: string;
}

export default function CompanySettingsPage() {
  const [company, setCompany] = useState<CompanyData>({ 
    name: '', 
    timezone: 'UTC',
    business_address: '',
    business_address_street: '',
    business_address_city: '',
    business_address_state: '',
    business_address_postal_code: '',
    business_address_country: '',
    phone: '',
    website: '',
    tax_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function loadCompany() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session in company page');
          setLoading(false);
          return;
        }

        console.log('Loading company for user:', session.user.id);

        // Get company from profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .single();

        console.log('Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('Error loading profile:', profileError);
          setLoading(false);
          return;
        }

        if (!profile?.company_id) {
          console.log('No company_id found in profile');
          setLoading(false);
          return;
        }

        console.log('Found company_id:', profile.company_id);

        // Get company details
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, timezone, business_address, business_address_street, business_address_city, business_address_state, business_address_postal_code, business_address_country, phone, website, tax_id, logo_url')
          .eq('id', profile.company_id)
          .single();
        
        console.log('Company query result:', { data, error });

        if (error) {
          console.error('Error loading company:', error);
        } else if (data) {
          console.log('Company data loaded:', data);
          setCompanyId(data.id);
          setCompany({
            name: data.name || '',
            timezone: data.timezone || 'UTC',
            business_address: data.business_address || '',
            business_address_street: data.business_address_street || '',
            business_address_city: data.business_address_city || '',
            business_address_state: data.business_address_state || '',
            business_address_postal_code: data.business_address_postal_code || '',
            business_address_country: data.business_address_country || '',
            phone: data.phone || '',
            website: data.website || '',
            tax_id: data.tax_id || '',
            logo_url: data.logo_url || null,
            id: data.id,
          });
        }
      } catch (err) {
        console.error('Unexpected error loading company:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !companyId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('company_id', companyId);

      const res = await fetch('/api/company/logo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || 'Failed to upload logo');
        return;
      }

      // Update local state with new logo URL
      setCompany((prev) => ({ ...prev, logo_url: data.url }));
      showSuccess('Logo uploaded successfully');
    } catch (err) {
      console.error('Error uploading logo:', err);
      showError('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
      // Reset file input
      e.target.value = '';
    }
  }

  async function handleLogoDelete() {
    if (!companyId) return;

    if (!confirm('Are you sure you want to delete the logo?')) {
      return;
    }

    setUploadingLogo(true);

    try {
      const res = await fetch(`/api/company/logo?company_id=${companyId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || 'Failed to delete logo');
        return;
      }

      // Update local state
      setCompany((prev) => ({ ...prev, logo_url: null }));
      showSuccess('Logo deleted successfully');
    } catch (err) {
      console.error('Error deleting logo:', err);
      showError('Failed to delete logo');
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate input
      const validation = companyUpdateSchema.safeParse(company);
      if (!validation.success) {
        const firstError = validation.error.issues[0];
        showError(firstError.message);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Get company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // Update company via API route (includes audit trail)
      const res = await fetch('/api/company', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: company.name,
          timezone: company.timezone,
          business_address: company.business_address || null,
          business_address_street: company.business_address_street || null,
          business_address_city: company.business_address_city || null,
          business_address_state: company.business_address_state || null,
          business_address_postal_code: company.business_address_postal_code || null,
          business_address_country: company.business_address_country || null,
          phone: company.phone || null,
          website: company.website || null,
          tax_id: company.tax_id || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update company');
      }

      showSuccess('Company settings updated successfully');
      
      // Reload company data to reflect changes (reuse existing profile variable)
      if (profile?.company_id) {
        const { data: updatedData } = await supabase
          .from('companies')
          .select('id, name, timezone, business_address, business_address_street, business_address_city, business_address_state, business_address_postal_code, business_address_country, phone, website, tax_id, logo_url')
          .eq('id', profile.company_id)
          .single();
        
        if (updatedData) {
          setCompany({
            name: updatedData.name || '',
            timezone: updatedData.timezone || 'UTC',
            business_address: updatedData.business_address || '',
            business_address_street: updatedData.business_address_street || '',
            business_address_city: updatedData.business_address_city || '',
            business_address_state: updatedData.business_address_state || '',
            business_address_postal_code: updatedData.business_address_postal_code || '',
            business_address_country: updatedData.business_address_country || '',
            phone: updatedData.phone || '',
            website: updatedData.website || '',
            tax_id: updatedData.tax_id || '',
            logo_url: updatedData.logo_url || null,
            id: updatedData.id,
          });
        }
      }
    } catch (err) {
      console.error('Error updating company:', err);
      showError(err instanceof Error ? err.message : 'Failed to update company settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Settings</h1>
        <p className="text-base text-gray-600">Manage your company information</p>
      </div>
      
      
      {loading ? (
        <Card>
          <CardBody>
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </CardBody>
        </Card>
      ) : (
        <>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Company Logo</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {company.logo_url ? (
              <div className="flex items-center gap-4">
                <img
                  src={company.logo_url}
                  alt="Company logo"
                  className="h-24 w-24 object-contain rounded-md border border-gray-200 bg-white p-2"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Current logo</p>
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium inline-block">
                        {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="hidden"
                      />
                    </label>
                    <Button
                      variant="ghost"
                      onClick={handleLogoDelete}
                      disabled={uploadingLogo}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-primary transition-colors">
                    <p className="text-sm text-gray-600 mb-2">
                      {uploadingLogo ? 'Uploading...' : 'Upload Company Logo'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP or SVG (max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Company Name"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              placeholder="Enter company name"
              required
            />
            <Select
              label="Timezone"
              value={company.timezone}
              onChange={(e) => setCompany({ ...company, timezone: e.target.value })}
              required
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </Select>
            <div className="space-y-4">
              <Input
                label="Street Address"
                value={company.business_address_street || ''}
                onChange={(e) => setCompany({ ...company, business_address_street: e.target.value })}
                placeholder="Enter street address"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={company.business_address_city || ''}
                  onChange={(e) => setCompany({ ...company, business_address_city: e.target.value })}
                  placeholder="Enter city"
                />
                {needsStateDropdown(company.business_address_country) ? (
                  <Select
                    label="State / Province"
                    value={company.business_address_state || ''}
                    onChange={(e) => setCompany({ ...company, business_address_state: e.target.value })}
                  >
                    <option value="">Select state/province</option>
                    {getStatesForCountry(company.business_address_country).map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    label="State / Province"
                    value={company.business_address_state || ''}
                    onChange={(e) => setCompany({ ...company, business_address_state: e.target.value })}
                    placeholder="Enter state or province"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  value={company.business_address_postal_code || ''}
                  onChange={(e) => setCompany({ ...company, business_address_postal_code: e.target.value })}
                  placeholder="Enter postal code"
                />
                <Select
                  label="Country"
                  value={company.business_address_country || ''}
                  onChange={(e) => {
                    // Clear state when country changes if new country doesn't support states
                    const newCountry = e.target.value;
                    const newState = needsStateDropdown(newCountry) ? company.business_address_state : '';
                    setCompany({ 
                      ...company, 
                      business_address_country: newCountry,
                      business_address_state: newState
                    });
                  }}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={company.phone || ''}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                placeholder="Enter phone number"
                type="tel"
              />
              <Input
                label="Website"
                value={company.website || ''}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                placeholder="example.com (http:// will be added automatically)"
                type="text"
                helperText="Enter website URL (e.g., example.com). http:// will be added automatically if missing."
              />
            </div>
            <Input
              label="Tax ID / ABN"
              value={company.tax_id || ''}
              onChange={(e) => setCompany({ ...company, tax_id: e.target.value })}
              placeholder="Enter tax ID or ABN"
            />
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardBody>
      </Card>
        </>
      )}
    </div>
  );
}
