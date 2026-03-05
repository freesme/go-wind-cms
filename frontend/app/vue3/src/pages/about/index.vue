<script setup lang='ts'>
import { definePage } from "unplugin-vue-router/runtime"
import { computed } from 'vue'
import { $t, i18n } from '@/locales'
import XIcon from '@/plugins/xicon/XIcon.vue'

definePage({
  name: 'about',
  meta: {
    level: 2,
  },
})

const features = computed(() => {
  void i18n.global.locale.value

  return [
    {
      icon: 'carbon:document-add',
      title: $t('page.about.feature_content'),
      description: $t('page.about.feature_content_desc'),
    },
    {
      icon: 'carbon:cloud-upload',
      title: $t('page.about.feature_multi_tenant'),
      description: $t('page.about.feature_multi_tenant_desc'),
    },
    {
      icon: 'carbon:security',
      title: $t('page.about.feature_security'),
      description: $t('page.about.feature_security_desc'),
    },
    {
      icon: 'carbon:api',
      title: $t('page.about.feature_api'),
      description: $t('page.about.feature_api_desc'),
    },
    {
      icon: 'carbon:collaborate',
      title: $t('page.about.feature_collaboration'),
      description: $t('page.about.feature_collaboration_desc'),
    },
    {
      icon: 'carbon:analytics',
      title: $t('page.about.feature_analytics'),
      description: $t('page.about.feature_analytics_desc'),
    },
  ]
})

const teamMembers = computed(() => {
  return [
    {
      name: $t('page.about.team_member_1'),
      role: $t('page.about.team_role_1'),
      avatar: '/logo.png',
    },
    {
      name: $t('page.about.team_member_2'),
      role: $t('page.about.team_role_2'),
      avatar: '/logo.png',
    },
    {
      name: $t('page.about.team_member_3'),
      role: $t('page.about.team_role_3'),
      avatar: '/logo.png',
    },
  ]
})
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('page.about.title') }}</h1>
        <p class="hero-subtitle">{{ $t('page.about.subtitle') }}</p>
        <p class="hero-description">{{ $t('page.about.description') }}</p>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="section-container">
        <div class="about-content">
          <h2>{{ $t('page.about.about_us') }}</h2>
          <p>{{ $t('page.about.about_us_desc_1') }}</p>
          <p>{{ $t('page.about.about_us_desc_2') }}</p>
          <p>{{ $t('page.about.about_us_desc_3') }}</p>
        </div>
        <div class="about-stats">
          <div class="stat-card">
            <div class="stat-number">10K+</div>
            <div class="stat-label">{{ $t('page.about.stat_users') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">500+</div>
            <div class="stat-label">{{ $t('page.about.stat_projects') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">{{ $t('page.about.stat_uptime') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">24/7</div>
            <div class="stat-label">{{ $t('page.about.stat_support') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2>{{ $t('page.about.features') }}</h2>
          <p>{{ $t('page.about.features_desc') }}</p>
        </div>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon">
              <XIcon :name="feature.icon" :size="32" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="section-container">
        <div class="section-header">
          <h2>{{ $t('page.about.team') }}</h2>
          <p>{{ $t('page.about.team_desc') }}</p>
        </div>
        <div class="team-grid">
          <div v-for="member in teamMembers" :key="member.name" class="team-card">
            <div class="team-avatar">
              <img :src="member.avatar" :alt="member.name" />
            </div>
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-container">
        <div class="section-header">
          <h2>{{ $t('page.about.values') }}</h2>
          <p>{{ $t('page.about.values_desc') }}</p>
        </div>
        <div class="values-grid">
          <div class="value-card">
            <h3>{{ $t('page.about.value_innovation') }}</h3>
            <p>{{ $t('page.about.value_innovation_desc') }}</p>
          </div>
          <div class="value-card">
            <h3>{{ $t('page.about.value_reliability') }}</h3>
            <p>{{ $t('page.about.value_reliability_desc') }}</p>
          </div>
          <div class="value-card">
            <h3>{{ $t('page.about.value_customer') }}</h3>
            <p>{{ $t('page.about.value_customer_desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <h2>{{ $t('page.about.cta_title') }}</h2>
        <p>{{ $t('page.about.cta_desc') }}</p>
        <div class="cta-buttons">
          <n-button type="primary" size="large" @click="$router.push('/post')">
            {{ $t('page.about.cta_explore') }}
          </n-button>
          <n-button type="default" size="large">
            {{ $t('page.about.cta_contact') }}
          </n-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang='less'>
.about-page {
  width: 100%;
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

// Hero Section
.hero {
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-accent) 100%);
  color: white;
  padding: 6rem var(--space-4);
  text-align: center;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    opacity: 0.95;
  }

  .hero-description {
    font-size: 1.1rem;
    opacity: 0.85;
    margin: 0;
    line-height: 1.6;
  }
}

// About Section
.about-section {
  padding: 4rem var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);

  .section-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .about-content {
    h2 {
      font-size: 2.5rem;
      margin: 0 0 1.5rem 0;
      color: var(--color-text-primary);
    }

    p {
      font-size: 1.05rem;
      line-height: 1.8;
      margin: 0 0 1.5rem 0;
      color: var(--color-text-secondary);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    .stat-card {
      background: var(--color-bg);
      padding: 2rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      text-align: center;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        border-color: var(--color-brand);
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--color-brand);
        margin: 0 0 0.5rem 0;
      }

      .stat-label {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
  }
}

// Features Section
.features-section {
  padding: 4rem var(--space-4);
  background: var(--color-bg);

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    h2 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
    }

    p {
      font-size: 1.1rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;

    .feature-card {
      background: var(--color-surface);
      padding: 2rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      text-align: center;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        border-color: var(--color-brand);
      }

      .feature-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        background: rgba(102, 126, 234, 0.1);
        border-radius: var(--radius-md);
        margin: 0 auto 1rem;
        color: var(--color-brand);
      }

      h3 {
        font-size: 1.25rem;
        margin: 0 0 0.75rem 0;
        color: var(--color-text-primary);
      }

      p {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}

// Team Section
.team-section {
  padding: 4rem var(--space-4);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    h2 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
    }

    p {
      font-size: 1.1rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;

    .team-card {
      text-align: center;
      padding: 2rem;
      border-radius: var(--radius-md);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);

        .team-avatar {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
      }

      .team-avatar {
        width: 120px;
        height: 120px;
        margin: 0 auto 1.5rem;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid var(--color-border);
        transition: all 0.3s;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      h3 {
        font-size: 1.25rem;
        margin: 0 0 0.5rem 0;
        color: var(--color-text-primary);
      }

      p {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
  }
}

// Values Section
.values-section {
  padding: 4rem var(--space-4);
  background: var(--color-bg);

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    h2 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
    }

    p {
      font-size: 1.1rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    .value-card {
      background: var(--color-surface);
      padding: 2.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      transition: all 0.3s;

      &:hover {
        border-color: var(--color-brand);
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);
      }

      h3 {
        font-size: 1.25rem;
        margin: 0 0 1rem 0;
        color: var(--color-text-primary);
      }

      p {
        font-size: 0.95rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}

// CTA Section
.cta-section {
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-accent) 100%);
  color: white;
  padding: 4rem var(--space-4);
  text-align: center;

  .section-container {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.95;
    margin: 0 0 2rem 0;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;

    :deep(.n-button) {
      font-size: 1rem;
      padding: 0 2rem;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .hero {
    padding: 3rem var(--space-4);

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-description {
      font-size: 0.95rem;
    }
  }

  .about-section {
    padding: 2rem var(--space-4);

    .section-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .about-content h2 {
      font-size: 1.75rem;
    }

    .about-stats {
      grid-template-columns: 1fr 1fr;
    }
  }

  .features-section,
  .team-section,
  .values-section {
    padding: 2rem var(--space-4);

    .section-header {
      h2 {
        font-size: 1.75rem;
      }
    }
  }

  .cta-section {
    padding: 2rem var(--space-4);

    h2 {
      font-size: 1.75rem;
    }

    .cta-buttons {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
}
</style>
