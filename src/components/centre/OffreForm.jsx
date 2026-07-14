import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiCamera, FiPlus, FiTrash2 } from "react-icons/fi";
import { Spinner } from "../UI/Spinner";

const categoryOptions = [
  { value: "Développement Web", label: "Développement Web" },
  { value: "Design", label: "Design" },
  { value: "Data Science", label: "Data Science" },
  { value: "Marketing", label: "Marketing" },
  { value: "Management", label: "Management" },
  { value: "Autre", label: "Autre" },
];

const modeOptions = [
  { value: "présentiel", label: "Présentiel" },
  { value: "en ligne", label: "En ligne" },
  { value: "hybride", label: "Hybride" },
];

export const OffreForm = ({ defaultValues = {}, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(defaultValues.image || "");

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      city: "",
      mode: "présentiel",
      price: "",
      duration: "",
      startDate: "",
      maxPlaces: "",
      availablePlaces: "",
      program: [""],
      offreStage: false,
      entreprisesPartenaires: [""],
      image: null,
      ...defaultValues,
    },
  });

  const programArray = useFieldArray({ name: "program", control });
  const partnersArray = useFieldArray({ name: "entreprisesPartenaires", control });

  const watchStage = watch("offreStage");
  const watchImage = watch("image");
  const watchMaxPlaces = watch("maxPlaces");
  const watchAvailablePlaces = watch("availablePlaces");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    if (defaultValues.image) {
      setPreview(defaultValues.image);
    }
  }, [watchImage, defaultValues.image]);

  useEffect(() => {
    reset({
      title: "",
      description: "",
      domain: "",
      city: "",
      mode: "présentiel",
      price: "",
      duration: "",
      startDate: "",
      maxPlaces: "",
      availablePlaces: "",
      program: [""],
      offreStage: false,
      entreprisesPartenaires: [""],
      image: null,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  const computedStatus = useMemo(() => {
    const max = Number(watchMaxPlaces);
    const available = Number(watchAvailablePlaces);
    if (Number.isFinite(max) && Number.isFinite(available) && available === 0) {
      return "full";
    }
    return defaultValues.status || "active";
  }, [watchMaxPlaces, watchAvailablePlaces, defaultValues.status]);

  const onFormSubmit = (data) => {
    const program = data.program?.filter((row) => row.trim().length > 0) || [];
    const entreprisesPartenaires = data.offreStage
      ? data.entreprisesPartenaires?.filter((row) => row.trim().length > 0) || []
      : [];

    onSubmit({
      ...data,
      program,
      entreprisesPartenaires,
      image: preview || defaultValues.image || "",
      price: Number(data.price),
      maxPlaces: Number(data.maxPlaces),
      availablePlaces: Number(data.availablePlaces),
      status: computedStatus,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("centre.form.generalInfo")}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("centre.form.generalInfoDescription")}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.title")}</label>
            <input
              {...register("title", { required: t("centre.form.required") })}
              placeholder={t("centre.form.titlePlaceholder")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.title && <p className="text-sm text-rose-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.city")}</label>
            <input
              {...register("city", { required: t("centre.form.required") })}
              placeholder={t("centre.form.cityPlaceholder")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.city && <p className="text-sm text-rose-500">{errors.city.message}</p>}
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.description")}</label>
            <textarea
              {...register("description", { required: t("centre.form.required") })}
              placeholder={t("centre.form.descriptionPlaceholder")}
              rows={5}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.description && <p className="text-sm text-rose-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.domain")}</label>
            <select
              {...register("domain", { required: t("centre.form.required") })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">{t("centre.form.selectDomain")}</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.domain && <p className="text-sm text-rose-500">{errors.domain.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.mode")}</label>
            <select
              {...register("mode", { required: t("centre.form.required") })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.mode && <p className="text-sm text-rose-500">{errors.mode.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.price")}</label>
            <input
              type="number"
              {...register("price", {
                required: t("centre.form.required"),
                min: { value: 1, message: t("centre.form.positivePrice") },
              })}
              placeholder="499"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.price && <p className="text-sm text-rose-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.duration")}</label>
            <input
              {...register("duration", { required: t("centre.form.required") })}
              placeholder={t("centre.form.durationPlaceholder")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.duration && <p className="text-sm text-rose-500">{errors.duration.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.startDate")}</label>
            <input
              type="date"
              {...register("startDate", {
                required: t("centre.form.required"),
                validate: (value) => {
                  if (!value) return true;
                  const selected = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selected >= today || t("centre.form.futureDate");
                },
              })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.startDate && <p className="text-sm text-rose-500">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.maxPlaces")}</label>
            <input
              type="number"
              {...register("maxPlaces", {
                required: t("centre.form.required"),
                min: { value: 1, message: t("centre.form.positivePlaces") },
              })}
              placeholder="30"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.maxPlaces && <p className="text-sm text-rose-500">{errors.maxPlaces.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("centre.form.availablePlaces")}</label>
            <input
              type="number"
              {...register("availablePlaces", {
                required: t("centre.form.required"),
                min: { value: 0, message: t("centre.form.positivePlaces") },
              })}
              placeholder="12"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.availablePlaces && <p className="text-sm text-rose-500">{errors.availablePlaces.message}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("centre.form.programSection")}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("centre.form.programSectionDescription")}</p>
        </div>

        <div className="space-y-4">
          {programArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <input
                {...register(`program.${index}`, { required: false })}
                defaultValue={field}
                placeholder={t("centre.form.modulePlaceholder")}
                className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => programArray.remove(index)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => programArray.append("")}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200"
          >
            <FiPlus /> {t("centre.form.addModule")}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("centre.form.internshipSection")}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("centre.form.internshipSectionDescription")}</p>
          </div>
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
            <input type="checkbox" {...register("offreStage")} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
            {t("centre.form.internshipLabel")}
          </label>
        </div>

        {watchStage && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            {partnersArray.fields.map((partner, index) => (
              <div key={partner.id} className="flex gap-3">
                <input
                  {...register(`entreprisesPartenaires.${index}`, { required: false })}
                  defaultValue={partner}
                  placeholder={t("centre.form.partnerPlaceholder")}
                  className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => partnersArray.remove(index)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => partnersArray.append("")}
              className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200"
            >
              <FiPlus /> {t("centre.form.addPartner")}
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("centre.form.imageSection")}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("centre.form.imageSectionDescription")}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <label className="group relative block min-h-[210px] overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-teal-400 dark:border-slate-700 dark:bg-slate-900">
            {preview ? (
              <img src={preview} alt={t("centre.form.coverImage")} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                <FiCamera className="h-10 w-10" />
                <p>{t("centre.form.coverImagePlaceholder")}</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="sr-only"
            />
          </label>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{t("centre.form.coverImage")}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("centre.form.coverImageHelp")}</p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Spinner className="h-4 w-4 text-white" /> : t(defaultValues.id ? "centre.form.submitUpdate" : "centre.form.submitCreate")}
        </button>
      </div>
    </form>
  );
};
