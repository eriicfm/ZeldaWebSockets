"use client";

import { useState, useEffect } from "react";
import {
  postMaterial,
  getMaterialsId,
  putMaterial,
  Material,
} from "@/app/api/materials/apiMaterials";
import { useRouter, useParams } from "next/navigation";
import type { Option } from "@/components/ui/multiselect";
import { CommonLocations } from "@/constants/common_locations";

// Definimos una interfaz para los valores del formulario
export interface MaterialFormValues {
  idNum: string;
  name: string;
  commonLocations: Option[];
  cookingEffect: string;
  description: string;
  heartsRecovered: number;
  image: string;
}

export interface ValidationErrors {
  idNum?: string;
  name?: string;
  commonLocations?: string;
  cookingEffect?: string;
  description?: string;
  heartsRecovered?: string;
  image?: string;
}

export const useMaterialForm = (isEditMode = false) => {
  const router = useRouter();
  const params = useParams();
  const materialId = params?.id ? Number(params.id) : undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [apiError, setApiError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Estado para cada campo del formulario
  const [formValues, setFormValues] = useState<MaterialFormValues>({
    idNum: "",
    name: "",
    commonLocations: [],
    description: "",
    cookingEffect: "",
    heartsRecovered: 0,
    image: "",
  });

  useEffect(() => {
    if (isEditMode && materialId) {
      fetchMaterial();
    }
  }, [isEditMode, materialId]);

  const fetchMaterial = async () => {
    try {
      setIsLoading(true);
      const materialData = await getMaterialsId(materialId!);

      if (materialData && materialData.length > 0) {
        const material = materialData[0];

        // Mapear las ubicaciones a Options
        const locationOptions = material.common_locations
          ? material.common_locations.map((location) => {
              const option = findOptionByLabel(CommonLocations, location);
              return option || { value: location, label: location };
            })
          : [];

        // Actualizar el formulario con los datos del monstruo
        setFormValues({
          idNum: material.id_num.toString(),
          name: material.name,
          commonLocations: locationOptions,
          cookingEffect: material.cooking_effect || "",
          description: material.description,
          heartsRecovered: material.hearts_recovered || 0,
          image: material.image || "",
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
  const updateField = (field: keyof MaterialFormValues, value: any) => {
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

    // Validar ubicaciones comunes
    if (formValues.commonLocations.length === 0) {
      errors.commonLocations = "Debes seleccionar al menos una ubicación";
      isValid = false;
    }

    // Validar cookingEffect
    if (!formValues.cookingEffect) {
      errors.cookingEffect = "El efecto de la comida es obligatorio";
      isValid = false;
    } else if (formValues.cookingEffect.length < 3) {
      errors.cookingEffect =
        "El efecto de la comida debe tener al menos 3 caracteres";
      isValid = false;
    } else if (formValues.cookingEffect.length > 50) {
      errors.cookingEffect =
        "El efecto de la comida debe tener menos de 50 caracteres";
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

    // Validar heartsRecovered
    if (!formValues.heartsRecovered) {
      errors.heartsRecovered = "El ID es obligatorio";
      isValid = false;
    } else if (isNaN(Number(formValues.heartsRecovered))) {
      errors.heartsRecovered = "El ID debe ser un número";
      isValid = false;
    } else if (Number(formValues.heartsRecovered) <= 0) {
      errors.heartsRecovered = "El ID debe ser mayor que 0";
      isValid = false;
    }

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
      const materialData = {
        id_num: parseInt(formValues.idNum),
        name: formValues.name,
        category: "materiales",
        common_locations: formValues.commonLocations.map(
          (location) => location.label
        ),
        cooking_effect: formValues.cookingEffect,
        description: formValues.description,
        hearts_recovered: formValues.heartsRecovered,
        image: formattedImage, // URL formateada
      };

      console.log(
        `${isEditMode ? "Actualizando" : "Creando"} monstruo:`,
        materialData
      );

      // Enviar al API (POST o PUT según el modo)
      if (isEditMode && materialId) {
        await putMaterial(materialId, materialData as Material);
      } else {
        await postMaterial(materialData as Material);
      }

      // Redireccionar a la lista de monstruos tras éxito
      router.push("/materials");
      router.refresh();
    } catch (err) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el material:`,
        err
      );
      setApiError(
        `Ocurrió un error al ${
          isEditMode ? "actualizar" : "crear"
        } el material: ${
          err instanceof Error ? err.message : "Error desconocido"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
