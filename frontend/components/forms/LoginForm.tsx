'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

type LoginData = {
	email: string;
	password: string;
	remember: boolean;
};

export default function LoginForm() {
	const router = useRouter();
	const setToken = useAuthStore((state) => state.setToken);

	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<LoginData>({
		mode: 'onChange',
	});

	const email = watch('email');
	const password = watch('password');

	const isValid = email?.includes('@') && password?.length > 0;

	const emailRegister = register('email', {
		required: 'El correo es obligatorio',
		pattern: {
			value: /\S+@\S+\.\S+/,
			message: 'Debe ser un correo válido',
		},
	});

	const passwordRegister = register('password', {
		required: 'La contraseña es obligatoria',
	});

	const onSubmit = async (data: LoginData) => {
		try {
			setLoading(true);
			setErrorMessage(null);

			const response = await api.post('/auth/login', {
				email: data.email,
				password: data.password,
			});

			const token = response.data.access_token;

			setToken(token, data.remember);

			document.cookie = `auth_token=${token}; path=/; ${
				data.remember ? 'max-age=604800;' : ''
			}`;

			router.push('/dashboard');
		} catch (error: unknown) {
			if (typeof error === 'object' && error !== null && 'response' in error) {
				const err = error as {
					response?: { status?: number };
				};

				if (err.response?.status === 401) {
					setErrorMessage('Correo o contraseña incorrectos.');
				} else {
					setErrorMessage('Ocurrió un error. Intenta nuevamente.');
				}
			} else {
				setErrorMessage('Ocurrió un error. Intenta nuevamente.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className='flex flex-col items-center mb-6'>
				<Image
					src='/tennisStar.png'
					alt='Tennis Star'
					width={120}
					height={40}
					className='mb-4'
				/>
				<h1 className='text-3xl font-semibold text-foreground'>
					Inicia Sesión
				</h1>
				<p className='text-sm text-muted-foreground mt-1'>
					Ingresa a tu cuenta para continuar
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<label className='text-sm font-medium'>Correo electrónico</label>
					<Input
						type='email'
						placeholder='ejemplo@mail.com'
						{...emailRegister}
						onChange={(e) => {
							setErrorMessage(null);
							emailRegister.onChange(e);
						}}
						className={`mt-1 ${
							errors.email ? 'border-destructive focus:ring-destructive' : ''
						}`}
					/>
					{errors.email && (
						<p className='text-xs text-destructive mt-1'>
							{errors.email.message}
						</p>
					)}
				</div>

				<div>
					<label className='text-sm font-medium'>Contraseña</label>
					<div className='relative'>
						<Input
							type={showPassword ? 'text' : 'password'}
							{...passwordRegister}
							onChange={(e) => {
								setErrorMessage(null);
								passwordRegister.onChange(e);
							}}
							className={`mt-1 pr-10 ${
								errors.password
									? 'border-destructive focus:ring-destructive'
									: ''
							}`}
						/>
						<button
							type='button'
							onClick={() => setShowPassword((prev) => !prev)}
							className='absolute right-3 top-3 text-muted-foreground'
						>
							{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
						</button>
					</div>
					{errors.password && (
						<p className='text-xs text-destructive mt-1'>
							{errors.password.message}
						</p>
					)}
				</div>

				<div className='flex items-center gap-2 text-sm'>
					<Checkbox {...register('remember')} />
					<span>Mantener sesión iniciada</span>
				</div>

				{errorMessage && (
					<p className='text-sm text-destructive text-center'>{errorMessage}</p>
				)}

				<Button
					type='submit'
					disabled={!isValid || loading}
					className='w-full'
					variant={isValid ? 'default' : 'outline'}
				>
					{loading && <Loader2 className='animate-spin mr-2' size={16} />}
					Iniciar Sesión
				</Button>
			</form>
		</div>
	);
}
