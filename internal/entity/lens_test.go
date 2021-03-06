package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewLens(t *testing.T) {
	t.Run("name F500-99 make Canon", func(t *testing.T) {
		lens := NewLens("F500-99", "Canon")
		assert.Equal(t, "F500-99", lens.LensModel)
		assert.Equal(t, "Canon", lens.LensMake)
		assert.Equal(t, "f500-99", lens.LensSlug)
	})
	t.Run("name Unknown make Unknown", func(t *testing.T) {
		lens := NewLens("", "")
		assert.Equal(t, "Unknown", lens.LensModel)
		assert.Equal(t, "", lens.LensMake)
		assert.Equal(t, "unknown", lens.LensSlug)
	})
}

func TestLens_TableName(t *testing.T) {
	lens := NewLens("F500-99", "Canon")
	tableName := lens.TableName()
	assert.Equal(t, "lenses", tableName)
}
