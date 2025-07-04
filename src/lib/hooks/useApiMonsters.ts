"use client";

import { useState, useEffect } from "react";
import {
  postMonster,
  getMonstersId,
  putMonster,
  Monster,
} from "@/app/api/monsters/apiMonters";
import { useRouter, useParams } from "next/navigation";
import type { Option } from "@/components/ui/multiselect";
import { CommonLocations } from "@/constants/common_locations";
import { MonsterDrops } from "@/constants/drops";

// Definimos una interfaz para los valores del formulario
export interface MonsterFormValues {
  idNum: string;
  name: string;
  commonLocations: Option[];
  description: string;
  monsterDrops: Option[];
  image: string;
}

// Interfaz para los errores de validación
export interface ValidationErrors {
  idNum?: string;
  name?: string;
  commonLocations?: string;
  description?: string;
  monsterDrops?: string;
  image?: string;
}

// Hook completo unificado
export const useMonsterFormComplete = (isEditMode = false) => {
  const router = useRouter();
  const params = useParams();
  const monsterId = params?.id ? Number(params.id) : undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [apiError, setApiError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Estado para cada campo del formulario
  const [formValues, setFormValues] = useState<MonsterFormValues>({
    idNum: "",
    name: "",
    commonLocations: [],
    description: "",
    monsterDrops: [],
    image: "",
  });

  // Efecto para cargar los datos del monstruo si estamos en modo edición
  useEffect(() => {
    if (isEditMode && monsterId) {
      fetchMonster();
    }
  }, [isEditMode, monsterId]);

  // Función para cargar un monstruo existente
  const fetchMonster = async () => {
    try {
      setIsLoading(true);
      const monsterData = await getMonstersId(monsterId!);

      if (monsterData && monsterData.length > 0) {
        const monster = monsterData[0];

        // Mapear las ubicaciones a Options
        const locationOptions = monster.common_locations
          ? monster.common_locations.map((location) => {
              const option = findOptionByLabel(CommonLocations, location);
              return option || { value: location, label: location };
            })
          : [];

        // Mapear los drops a Options
        const dropOptions = monster.drops
          ? monster.drops.map((drop) => {
              const option = findOptionByLabel(MonsterDrops, drop);
              return option || { value: drop, label: drop };
            })
          : [];

        // Actualizar el formulario con los datos del monstruo
        setFormValues({
          idNum: monster.id_num.toString(),
          name: monster.name,
          commonLocations: locationOptions,
          description: monster.description,
          monsterDrops: dropOptions,
          image: monster.image || "",
        });
      } else {
        setApiError("No se encontró el monstruo con el ID especificado");
      }
    } catch (err) {
      console.error("Error al cargar el monstruo:", err);
      setApiError("No se pudo cargar la información del monstruo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar un campo específico
  const updateField = (field: keyof MonsterFormValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    // Limpiar error de validación de este campo cuando se actualiza
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Función para validar los datos del formulario
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validar ID
    if (!formValues.idNum) {
      errors.idNum = "El ID es obligatorio";
      isValid = false;
    } else if (isNaN(Number(formValues.idNum))) {
      errors.idNum = "El ID debe ser un número";
      isValid = false;
    } else if (Number(formValues.idNum) <= 0) {
      errors.idNum = "El ID debe ser mayor que 0";
      isValid = false;
    }

    // Validar nombre
    if (!formValues.name) {
      errors.name = "El nombre es obligatorio";
      isValid = false;
    } else if (formValues.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    } else if (formValues.name.length > 50) {
      errors.name = "El nombre debe tener menos de 50 caracteres";
      isValid = false;
    }

    // Validar ubicaciones
    if (formValues.commonLocations.length === 0) {
      errors.commonLocations = "Selecciona al menos una ubicación";
      isValid = false;
    }

    // Validar descripción
    if (!formValues.description) {
      errors.description = "La descripción es obligatoria";
      isValid = false;
    } else if (formValues.description.length < 10) {
      errors.description = "La descripción debe tener al menos 10 caracteres";
      isValid = false;
    }

    // Validar imagen
    if (!formValues.image) {
      errors.image = "La URL de la imagen es obligatoria";
      isValid = false;
    } else {
      try {
        const url = new URL(formValues.image);
        if (!url.protocol.startsWith("http")) {
          errors.image = "La URL debe comenzar con http:// o https://";
          isValid = false;
        }
      } catch {
        errors.image = "La URL de la imagen no es válida";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validar el formulario primero
    if (!validateForm()) {
      return;
    }

    let formattedImage = formValues.image;
    if (
      formValues.image &&
      !formValues.image.startsWith("http://") &&
      !formValues.image.startsWith("https://")
    ) {
      formattedImage = `https://${formValues.image}`;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      // Crear el objeto monstruo con los datos del formulario
      const monsterData = {
        id_num: parseInt(formValues.idNum),
        name: formValues.name,
        category: "monstruos",
        common_locations: formValues.commonLocations.map(
          (location) => location.label
        ),
        description: formValues.description,
        drops: formValues.monsterDrops.map((drop) => drop.label),
        image: formattedImage, // URL formateada
      };

      console.log(
        `${isEditMode ? "Actualizando" : "Creando"} monstruo:`,
        monsterData
      );

      // Enviar al API (POST o PUT según el modo)
      if (isEditMode && monsterId) {
        await putMonster(monsterId, monsterData as Monster);
      } else {
        await postMonster(monsterData as Monster);
      }

      // Redireccionar a la lista de monstruos tras éxito
      router.push("/monsters");
      router.refresh();
    } catch (err) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el monstruo:`,
        err
      );
      setApiError(
        `Ocurrió un error al ${
          isEditMode ? "actualizar" : "crear"
        } el monstruo: ${
          err instanceof Error ? err.message : "Error desconocido"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función auxiliar para encontrar opciones por etiqueta
  const findOptionByLabel = (
    options: Option[],
    label: string
  ): Option | undefined => {
    return options.find(
      (option) => option.label.toLowerCase() === label.toLowerCase()
    );
  };

  return {
    formValues,
    updateField,
    validationErrors,
    apiError,
    isSubmitting,
    isLoading,
    handleSubmit,
  };
};
