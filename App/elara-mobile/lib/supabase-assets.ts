import type { User } from "@supabase/supabase-js";

import type {
  AssetSource,
  AssetType,
  Currency,
  ElaraAsset,
} from "./portfolio-store";
import { supabase } from "./supabase";

type SupabaseAssetRow = {
  id: string;
  user_id: string;
  portfolio_id: string | null;
  name: string;
  asset_type: AssetType;
  quantity: string | number | null;
  current_value: string | number;
  currency: Currency;
  source: AssetSource;
  provider: string | null;
  external_id: string | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseAssetInput = {
  name: string;
  asset_type: AssetType;
  quantity?: number;
  current_value: number;
  currency: Currency;
  source?: AssetSource;
  provider?: string;
  external_id?: string;
  raw_payload?: Record<string, unknown>;
};

export type SupabaseAssetUpdateInput = Partial<SupabaseAssetInput>;

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return undefined;
  }

  return numericValue;
}

function mapSupabaseAsset(row: SupabaseAssetRow): ElaraAsset {
  return {
    id: row.id,
    name: row.name,
    asset_type: row.asset_type,
    quantity: toNumber(row.quantity),
    current_value: toNumber(row.current_value) ?? 0,
    currency: row.currency,
    source: row.source,
    provider: row.provider ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function ensureProfile(user: User) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchSupabaseAssets(user: User) {
  await ensureProfile(user);

  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapSupabaseAsset(row as SupabaseAssetRow));
}

export async function createSupabaseAsset(
  user: User,
  input: SupabaseAssetInput
) {
  await ensureProfile(user);

  const { data, error } = await supabase
    .from("assets")
    .insert({
      user_id: user.id,
      portfolio_id: null,
      name: input.name,
      asset_type: input.asset_type,
      quantity: input.quantity ?? null,
      current_value: input.current_value,
      currency: input.currency,
      source: input.source ?? "manual",
      provider: input.provider ?? null,
      external_id: input.external_id ?? null,
      raw_payload: input.raw_payload ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSupabaseAsset(data as SupabaseAssetRow);
}

export async function updateSupabaseAsset(
  user: User,
  assetId: string,
  input: SupabaseAssetUpdateInput
) {
  await ensureProfile(user);

  const updatePayload: Record<string, unknown> = {};

  if (input.name !== undefined) {
    updatePayload.name = input.name;
  }

  if (input.asset_type !== undefined) {
    updatePayload.asset_type = input.asset_type;
  }

  if (input.quantity !== undefined) {
    updatePayload.quantity = input.quantity;
  }

  if (input.current_value !== undefined) {
    updatePayload.current_value = input.current_value;
  }

  if (input.currency !== undefined) {
    updatePayload.currency = input.currency;
  }

  if (input.source !== undefined) {
    updatePayload.source = input.source;
  }

  if (input.provider !== undefined) {
    updatePayload.provider = input.provider;
  }

  if (input.external_id !== undefined) {
    updatePayload.external_id = input.external_id;
  }

  if (input.raw_payload !== undefined) {
    updatePayload.raw_payload = input.raw_payload;
  }

  const { data, error } = await supabase
    .from("assets")
    .update(updatePayload)
    .eq("id", assetId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSupabaseAsset(data as SupabaseAssetRow);
}

export async function deleteSupabaseAsset(user: User, assetId: string) {
  await ensureProfile(user);

  const { error } = await supabase
    .from("assets")
    .delete()
    .eq("id", assetId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function replaceSupabaseAssetsBySource(
  user: User,
  source: AssetSource,
  assets: SupabaseAssetInput[]
) {
  await ensureProfile(user);

  const { error: deleteError } = await supabase
    .from("assets")
    .delete()
    .eq("user_id", user.id)
    .eq("source", source);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (assets.length === 0) {
    return [];
  }

  const insertPayload = assets.map((asset) => ({
    user_id: user.id,
    portfolio_id: null,
    name: asset.name,
    asset_type: asset.asset_type,
    quantity: asset.quantity ?? null,
    current_value: asset.current_value,
    currency: asset.currency,
    source: asset.source ?? source,
    provider: asset.provider ?? null,
    external_id: asset.external_id ?? null,
    raw_payload: asset.raw_payload ?? null,
  }));

  const { data, error } = await supabase
    .from("assets")
    .insert(insertPayload)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapSupabaseAsset(row as SupabaseAssetRow));
}