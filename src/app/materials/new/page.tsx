"use client";

import Field from "@/components/forms/TextField";
import { CommonLocations } from "@/constants/common_locations";
import Multiselect from "@/components/forms/MultiSelect";
import { useMaterialForm } from "@/lib/hooks/useApiMaterials";

export default function NewMaterial() {
  const {
    formValues,
    updateField,
    validationErrors,
    isSubmitting,
    apiError,
    handleSubmit,
  } = useMaterialForm();

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-center text-yellow-500 drop-shadow-md mb-6">
          New Material
        </h1>

        {apiError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Field
              label="Id Num"
              type="number"
              placeholder="Introduce el id del material"
              required
              value={formValues.idNum}
              onChange={(e) => updateField("idNum", e.target.value)}
            />
            {validationErrors.idNum && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.idNum}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Name"
              type="text"
              placeholder="Introduce el nombre del material"
              required
              value={formValues.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <Multiselect
              label="Common Locations"
              options={CommonLocations}
              placeholder="Selecciona la localización"
              value={formValues.commonLocations}
              onChange={(value) => updateField("commonLocations", value)}
            />
            {validationErrors.commonLocations && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.commonLocations}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Cooking Effect"
              type="text"
              placeholder="Introduce el efecto de la comida"
              required
              value={formValues.cookingEffect}
              onChange={(e) => updateField("cookingEffect", e.target.value)}
            />
            {validationErrors.cookingEffect && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.cookingEffect}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Description"
              type="text"
              placeholder="Introduce la descripción del material"
              required
              value={formValues.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Hearts Recovered"
              type="number"
              placeholder="Introduce el número de corazones recuperados"
              required
              value={formValues.heartsRecovered}
              onChange={(e) => updateField("heartsRecovered", e.target.value)}
            />
            {validationErrors.heartsRecovered && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.heartsRecovered}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Field
              label="Image URL"
              type="text"
              placeholder="Introduce la URL de la imagen"
              required
              value={formValues.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Asegúrate de incluir http:// o https:// al inicio</span>
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() =>
                  updateField(
                    "image",
                    "https://botw-compendium.herokuapp.com/api/v3/compendium/entry/hearty_durian/image"
                  )
                }
              >
                Usar imagen de ejemplo
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creando..." : "Create Monster"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
