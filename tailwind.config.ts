import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			zone: {
  				red: {
  					primary: '#8B0000',
  					accent: '#FF4444',
  					base: '#0D0D0D',
  					secondary: '#2A2A2A',
  					metallic: '#E8E8E8'
  				},
  				yellow: {
  					primary: '#8B7500',
  					accent: '#FFD700',
  					base: '#000000',
  					secondary: '#5A5A5A',
  					metallic: '#F0F0F0'
  				},
  				orange: {
  					primary: '#A0522D',
  					accent: '#FF8C42',
  					base: '#0A0A0A',
  					secondary: '#424242',
  					metallic: '#E8E8E8'
  				},
  				green: {
  					primary: '#2F4538',
  					accent: '#5FD35F',
  					base: '#101010',
  					secondary: '#4A5D4F',
  					metallic: '#F0F0F0'
  				},
  				blue: {
  					primary: '#1C2841',
  					accent: '#6B9BD1',
  					base: '#0C0C0C',
  					secondary: '#3D3D3D',
  					metallic: '#E8E8E8'
  				},
  				purple: {
  					primary: '#3E2347',
  					accent: '#C77DFF',
  					base: '#0F0F0F',
  					secondary: '#333333',
  					metallic: '#F0D0D8'
  				},
  				pink: {
  					primary: '#8B2252',
  					accent: '#FF69B4',
  					base: '#0A0A0A',
  					secondary: '#383838',
  					metallic: '#F0E8E8'
  				}
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in-left': {
  				from: {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-in-right': {
  				from: {
  					opacity: '0',
  					transform: 'translateX(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-up': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'scale-in': {
  				from: {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					backgroundPosition: '-1000px 0'
  				},
  				'100%': {
  					backgroundPosition: '1000px 0'
  				}
  			},
  			'pulse-glow': {
  				'0%, 100%': {
  					opacity: '1',
  					boxShadow: '0 0 20px rgba(var(--primary), 0.3)'
  				},
  				'50%': {
  					opacity: '0.8',
  					boxShadow: '0 0 30px rgba(var(--primary), 0.5)'
  				}
  			},
  			'bounce-subtle': {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-5px)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.5s ease-out',
  			'slide-in-left': 'slide-in-left 0.5s ease-out',
  			'slide-in-right': 'slide-in-right 0.5s ease-out',
  			'slide-up': 'slide-up 0.5s ease-out',
  			'scale-in': 'scale-in 0.3s ease-out',
  			'shimmer': 'shimmer 2s linear infinite',
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
