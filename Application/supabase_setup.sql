-- =====================================================
-- Supabase SQL Setup Script
-- Multispectral Plant Disease Detection System
-- Run this in Supabase SQL Editor (Dashboard > SQL)
-- =====================================================

-- ── PREDICTIONS TABLE ───────────────────────────────

CREATE TABLE IF NOT EXISTS predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    disease_name TEXT NOT NULL,
    confidence FLOAT NOT NULL DEFAULT 0,
    bbox_data JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);

-- ── RECOMMENDATIONS TABLE ───────────────────────────

CREATE TABLE IF NOT EXISTS recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    recommendation_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_prediction_id ON recommendations(prediction_id);

-- ── ROW LEVEL SECURITY ─────────────────────────────

-- Enable RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Predictions: users can only CRUD their own records
CREATE POLICY "Users can view own predictions"
    ON predictions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
    ON predictions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions"
    ON predictions FOR DELETE
    USING (auth.uid() = user_id);

-- Recommendations: users can read recommendations linked to their predictions
CREATE POLICY "Users can view own recommendations"
    ON recommendations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM predictions
            WHERE predictions.id = recommendations.prediction_id
            AND predictions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own recommendations"
    ON recommendations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM predictions
            WHERE predictions.id = recommendations.prediction_id
            AND predictions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own recommendations"
    ON recommendations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM predictions
            WHERE predictions.id = recommendations.prediction_id
            AND predictions.user_id = auth.uid()
        )
    );

-- =====================================================
-- DONE! Tables and RLS policies created successfully.
-- =====================================================
