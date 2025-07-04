"use client";

import Field from "@/components/forms/TextField";
import { CommonLocations } from "@/constants/common_locations";
import { MonsterDrops } from "@/constants/drops";
import Multiselect from "@/components/forms/MultiSelect";
import { useMonsterFormComplete } from "@/lib/hooks/useApiMonsters";
import { useRouter } from "next/navigation";

export default function EditMonster() {
  const router = useRouter();
  const {
    formValues,
    updateField,
    validationErrors,
    apiError,
    isSubmitting,
    isLoading, // Asegúrate de obtener este estado
    handleSubmit,
  } = useMonsterFormComplete(true); // <-- Pasa true para indicar modo edición

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-xl text-yellow-600">
          Cargando datos del monstruo...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-center text-yellow-500 drop-shadow-md mb-6">
          Editar Monstruo
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
              placeholder="Introduce el id del monstruo"
              required
              value={formValues.idNum}
              onChange={(e) => updateField("idNum", e.target.value)}
              disabled={true} // No permitir cambiar el ID
            />
            {validationErrors?.idNum && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.idNum}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Name"
              type="text"
              placeholder="Introduce el nombre del monstruo"
              required
              value={formValues.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            {validationErrors?.name && (
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
            {validationErrors?.commonLocations && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.commonLocations}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Description"
              type="text"
              placeholder="Introduce la descripción del monstruo"
              required
              value={formValues.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            {validationErrors?.description && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          <div>
            <Multiselect
              label="Monster Drops"
              options={MonsterDrops}
              placeholder="Selecciona los drops del monstruo"
              value={formValues.monsterDrops}
              onChange={(value) => updateField("monsterDrops", value)}
            />
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
            {validationErrors?.image && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.image}
              </p>
            )}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Asegúrate de incluir http:// o https:// al inicio</span>
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() =>
                  updateField(
                    "image",
                    "https://botw-compendium.herokuapp.com/api/v3/compendium/entry/bokoblin/image"
                  )
                }
              >
                Usar imagen de ejemplo
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
