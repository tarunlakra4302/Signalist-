'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Alert } from '@/database/models/alert.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function createAlert(data: {
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'upper' | 'lower';
  threshold: number;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectToDatabase();

    await Alert.create({
      userId: session.user.id,
      symbol: data.symbol.toUpperCase(),
      company: data.company,
      alertName: data.alertName,
      alertType: data.alertType,
      threshold: data.threshold,
      isActive: true,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (err) {
    console.error('createAlert error:', err);
    return { success: false, error: 'Failed to create alert' };
  }
}

export async function updateAlert(
  alertId: string,
  data: {
    alertName: string;
    alertType: 'upper' | 'lower';
    threshold: number;
  }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectToDatabase();

    await Alert.updateOne(
      { _id: alertId, userId: session.user.id },
      {
        alertName: data.alertName,
        alertType: data.alertType,
        threshold: data.threshold,
      }
    );

    return { success: true };
  } catch (err) {
    console.error('updateAlert error:', err);
    return { success: false, error: 'Failed to update alert' };
  }
}

export async function deleteAlert(alertId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectToDatabase();

    await Alert.deleteOne({
      _id: alertId,
      userId: session.user.id,
    });

    return { success: true };
  } catch (err) {
    console.error('deleteAlert error:', err);
    return { success: false, error: 'Failed to delete alert' };
  }
}

export async function getUserAlerts() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', data: [] };
    }

    await connectToDatabase();

    const alerts = await Alert.find({ userId: session.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: alerts.map((alert) => ({
        id: alert._id.toString(),
        symbol: alert.symbol,
        company: alert.company,
        alertName: alert.alertName,
        alertType: alert.alertType,
        threshold: alert.threshold,
        createdAt: alert.createdAt,
      })),
    };
  } catch (err) {
    console.error('getUserAlerts error:', err);
    return { success: false, error: 'Failed to fetch alerts', data: [] };
  }
}

export async function getAlertsBySymbol(symbol: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', data: [] };
    }

    await connectToDatabase();

    const alerts = await Alert.find({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: alerts.map((alert) => ({
        id: alert._id.toString(),
        symbol: alert.symbol,
        company: alert.company,
        alertName: alert.alertName,
        alertType: alert.alertType,
        threshold: alert.threshold,
        createdAt: alert.createdAt,
      })),
    };
  } catch (err) {
    console.error('getAlertsBySymbol error:', err);
    return { success: false, error: 'Failed to fetch alerts', data: [] };
  }
}

export async function toggleAlertStatus(alertId: string, isActive: boolean) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectToDatabase();

    await Alert.updateOne(
      { _id: alertId, userId: session.user.id },
      { isActive }
    );

    return { success: true };
  } catch (err) {
    console.error('toggleAlertStatus error:', err);
    return { success: false, error: 'Failed to toggle alert status' };
  }
}
