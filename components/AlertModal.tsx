'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAlert, updateAlert } from '@/lib/actions/alert.actions';
import { toast } from 'sonner';

interface AlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  symbol: string;
  company: string;
  alertId?: string;
  alertData?: {
    alertName: string;
    alertType: 'upper' | 'lower';
    threshold: string;
  };
  onSuccess?: () => void;
}

export default function AlertModal({
  open,
  setOpen,
  symbol,
  company,
  alertId,
  alertData,
  onSuccess,
}: AlertModalProps) {
  const isEditing = !!alertId;
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    alertName: alertData?.alertName || '',
    alertType: alertData?.alertType || ('upper' as 'upper' | 'lower'),
    threshold: alertData?.threshold || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.alertName || !formData.threshold) {
      toast.error('Please fill in all fields');
      return;
    }

    const thresholdNum = parseFloat(formData.threshold);
    if (isNaN(thresholdNum) || thresholdNum <= 0) {
      toast.error('Please enter a valid price threshold');
      return;
    }

    startTransition(async () => {
      try {
        let result;

        if (isEditing) {
          result = await updateAlert(alertId, {
            alertName: formData.alertName,
            alertType: formData.alertType,
            threshold: thresholdNum,
          });
        } else {
          result = await createAlert({
            symbol,
            company,
            alertName: formData.alertName,
            alertType: formData.alertType,
            threshold: thresholdNum,
          });
        }

        if (result.success) {
          toast.success(isEditing ? 'Alert updated successfully' : 'Alert created successfully');
          setOpen(false);
          setFormData({ alertName: '', alertType: 'upper', threshold: '' });
          onSuccess?.();
        } else {
          toast.error(result.error || 'Failed to save alert');
        }
      } catch (error) {
        console.error('Alert submission error:', error);
        toast.error('An error occurred');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-[#141414] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            {isEditing ? 'Edit Alert' : 'Create Price Alert'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="symbol" className="text-gray-300">
              Stock
            </Label>
            <Input
              id="symbol"
              value={`${symbol} - ${company}`}
              disabled
              className="mt-1 bg-gray-900 border-gray-700 text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="alertName" className="text-gray-300">
              Alert Name
            </Label>
            <Input
              id="alertName"
              placeholder="e.g., Price reaches $150"
              value={formData.alertName}
              onChange={(e) => setFormData({ ...formData, alertName: e.target.value })}
              className="mt-1 bg-gray-900 border-gray-700 text-gray-100"
              required
            />
          </div>

          <div>
            <Label htmlFor="alertType" className="text-gray-300">
              Alert Type
            </Label>
            <Select
              value={formData.alertType}
              onValueChange={(value) =>
                setFormData({ ...formData, alertType: value as 'upper' | 'lower' })
              }
            >
              <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="upper" className="text-gray-100">
                  Upper (Price goes above)
                </SelectItem>
                <SelectItem value="lower" className="text-gray-100">
                  Lower (Price goes below)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="threshold" className="text-gray-300">
              Price Threshold ($)
            </Label>
            <Input
              id="threshold"
              type="number"
              step="0.01"
              placeholder="150.00"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
              className="mt-1 bg-gray-900 border-gray-700 text-gray-100"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600"
              disabled={isPending}
            >
              {isPending ? 'Saving...' : isEditing ? 'Update Alert' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
